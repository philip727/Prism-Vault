package account

import (
	"errors"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/philp727/warframe-app-server/controllers/accountcontroller"
	"github.com/philp727/warframe-app-server/controllers/usercontroller"
	"github.com/philp727/warframe-app-server/models/db"
	"github.com/philp727/warframe-app-server/types"
	"gorm.io/gorm"
)

func verifyPasswordChangePayload(p types.ChangePasswordPayload) bool {
	return len(p.PreviousPassword) > 0 && len(p.NewPassword) > 0 && len(p.ConfirmNewPassword) > 0
}

func changePassword(c *fiber.Ctx, dbc *gorm.DB) error {
	userId, ok := c.Locals("userId").(uint32)
	if !ok {
		return c.Status(500).SendString("Internal Server Error when trying to parse the user id from a session token")
	}

	var payload types.ChangePasswordPayload

	if err := c.BodyParser(&payload); err != nil {
		return c.SendStatus(400)
	}

	if !verifyPasswordChangePayload(payload) {
		return c.Status(400).SendString("Fill in all required fields")
	}

	fmt.Println(userId)
	if err := accountcontroller.UpdatePassword(userId, payload, dbc); err != nil {
		var payloadError *usercontroller.PayloadError
		var unauthorizedError *usercontroller.UnauthorizedError
		var existsError *db.ExistsError

		if errors.As(err, &payloadError) || errors.As(err, &existsError) {
			return c.Status(400).SendString(err.Error())
		}

		if errors.As(err, &unauthorizedError) {
			return c.Status(401).SendString(err.Error())
		}
		return c.Status(500).SendString(err.Error())
	}

	return c.SendStatus(200)
}
