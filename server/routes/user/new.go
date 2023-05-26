package user

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/philp727/warframe-app-server/controllers/usercontroller"
	"github.com/philp727/warframe-app-server/models/db"
	"github.com/philp727/warframe-app-server/types"
	"gorm.io/gorm"
)

func validatePayload(p types.NewUserPayload) bool {
    return len(p.Username) > 0 && len(p.Email) > 0 && len(p.Password) > 0 && len(p.CPassword) > 0
}

// Manages the respones that get sent to the user
func newUser(c *fiber.Ctx, dbc *gorm.DB) error {
    c.Accepts("application/json")

    var payload types.NewUserPayload
    
    if err := c.BodyParser(&payload); err != nil {
        return c.SendStatus(400)
    }
    
    if !validatePayload(payload) {
        return c.Status(400).SendString("Fill in all required fields")
    }

    if err := usercontroller.InsertUser(dbc, payload); err != nil {
        var existError *db.ExistsError

        if errors.As(err, &existError) {
            return c.Status(400).SendString(err.Error())
        }

        return c.Status(501).SendString(err.Error())
    }

	return c.SendStatus(200)
}
