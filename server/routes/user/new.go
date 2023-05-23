package user

import "github.com/gofiber/fiber/v2"

// Manages the respones that get sent to the user
func newUser(c *fiber.Ctx) error {

    return c.SendStatus(501)
}
