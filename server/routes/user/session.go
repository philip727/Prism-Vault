package user

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/philp727/warframe-app-server/controllers/usercontroller"
	"github.com/philp727/warframe-app-server/models/db"
	"github.com/philp727/warframe-app-server/types"
	"gorm.io/gorm"
)

func validateLoginPayload(p types.LoginPayload) bool {
	return len(p.Identifier) > 0 && len(p.Password) > 0
}

func newLoginSession(c *fiber.Ctx, dbc *gorm.DB) error {
	c.Accepts("application/json")

	var payload types.LoginPayload

	if err := c.BodyParser(&payload); err != nil {
		return c.SendStatus(400)
	}

	if !validateLoginPayload(payload) {
		return c.Status(400).SendString("Fill in all required fields")
	}

	userInfo, err := usercontroller.MatchInformation(payload, dbc)
	if err != nil {
		var payloadError *usercontroller.PayloadError
		var unauthorizedError *usercontroller.UnauthorizedError
		var existsError *db.ExistsError

		if errors.As(err, &payloadError) || errors.As(err, &existsError) {
			return c.Status(400).SendString(err.Error())
		}

		if errors.As(err, &unauthorizedError) {
			return c.Status(401).SendString(err.Error())
		}

		return c.Status(501).SendString(err.Error())
	}

	return c.Status(200).JSON(userInfo)
}
