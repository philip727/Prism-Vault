package user

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func CreateRoute(f *fiber.App, dbc *gorm.DB) {
    user := f.Group("/user");

    // Register the user
    user.Post("/new", func(c *fiber.Ctx) error {
        return newUser(c, dbc)
    })

    // Login the user and create a new session
    user.Post("/session", func(c *fiber.Ctx) error {
        return newLoginSession(c, dbc)
    })

    // Verifies the user session token
    user.Post("/verify", func(c *fiber.Ctx) error {
        return verifySession(c, dbc)
    })
}
