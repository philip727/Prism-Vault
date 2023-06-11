package user

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/philp727/warframe-app-server/controllers/usercontroller"
	"gorm.io/gorm"
)

func validateSessionPayload(t string) bool {
	return len(t) > 0
}

func verifySession(c *fiber.Ctx, dbc *gorm.DB) error {
	c.Accepts("application/json")

	session := c.GetReqHeaders()["Session-Token"]
	if !validateSessionPayload(session) {
		return c.SendStatus(400)
	}

	result, err := usercontroller.VerifySessionToken(session, dbc)
	if err != nil {
		var unauthorizedError *usercontroller.UnauthorizedError

		if errors.As(err, &unauthorizedError) {
			return c.Status(401).SendString(err.Error())
		}

		return c.Status(500).SendString(err.Error())
	}

	return c.Status(200).JSON(result.ToSafe())
}
