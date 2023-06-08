package sessionauth

import (
	"errors"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/philp727/warframe-app-server/controllers/usercontroller"
)

// Verifies the session provided in the session-token header
func New(cfg ...Config) fiber.Handler {
	config := configDefault(cfg...)
	return func(c *fiber.Ctx) error {
		session := c.GetReqHeaders()["Session-Token"]

        fmt.Println(fmt.Sprint("sesssion: ", session));

		user, err := usercontroller.VerifySessionToken(session, config.DatabaseConnection)
		if err != nil {
			var unauthorizedError *usercontroller.UnauthorizedError

			if errors.As(err, &unauthorizedError) {
				return c.Status(401).SendString(err.Error())
			}

			return c.Status(500).SendString(err.Error())
		}

		c.Locals("userId", user.Id)

		return c.Next()
	}
}
