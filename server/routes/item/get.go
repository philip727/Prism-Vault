package item

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/philp727/warframe-app-server/controllers/itemcontroller"
	"github.com/philp727/warframe-app-server/types"
	"gorm.io/gorm"
)

func getItemComponents(c *fiber.Ctx, dbc *gorm.DB) error {
	c.Accepts("application/json")
	var payload types.GetItemPayload

	if err := c.BodyParser(&payload); err != nil {
		return c.SendStatus(400)
	}

    fmt.Println(payload)

	userId, ok := c.Locals("userId").(uint32)
	if !ok {
		return c.Status(500).SendString("Internal Server Error when trying to parse the user id from a session token")
	}

	strings, err := itemcontroller.GetComponents(userId, payload, dbc)
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	return c.JSON(strings)
}
