package user

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/philp727/warframe-app-server/controllers/usercontroller"
	"gorm.io/gorm"
)

type payload struct {
    Token string `json:"session_token"`
}

func validateSessionPayload(p payload) bool {
	return len(p.Token) > 0
}

func verifySession(c *fiber.Ctx, dbc *gorm.DB) error {
	c.Accepts("application/json")

	var payload payload

	if err := c.BodyParser(&payload); err != nil {
		return c.SendStatus(400)
	}

	if !validateSessionPayload(payload) {
		return c.SendStatus(400)
	}

	result, err := usercontroller.VerifySessionToken(payload.Token, dbc)
	if err != nil {
		var unauthorizedError *usercontroller.UnauthorizedError

		if errors.As(err, &unauthorizedError) {
			return c.Status(401).SendString(err.Error())
		}

        return c.Status(500).SendString(err.Error())
	}

	return c.Status(200).JSON(result.ToSafe())
}
