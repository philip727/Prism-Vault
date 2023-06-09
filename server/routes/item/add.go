package item

import (
	"github.com/gofiber/fiber/v2"
	"github.com/philp727/warframe-app-server/controllers/itemcontroller"
	"github.com/philp727/warframe-app-server/types"
	"gorm.io/gorm"
)

func verifyAddItemPayload(p types.AddItemPayload) bool {
    return len(p.UniqueName) > 0
}

func addItem(c *fiber.Ctx, dbc *gorm.DB) error {
	c.Accepts("application/json")

	userId, ok := c.Locals("userId").(uint32)
	if !ok {
		return c.Status(500).SendString("Internal Server Error when trying to parse the user id from a session token")
	}

	var payload types.AddItemPayload

	if err := c.BodyParser(&payload); err != nil {
		return c.SendStatus(400)
	}

    if !verifyAddItemPayload(payload) {
        return c.SendStatus(400)
    }

    if payload.Quantity < 0 {
        return c.Status(400).SendString("You have provided a quantity below 0, this is not possible")
    }

    if payload.Quantity > 9999 {
        return c.Status(400).SendString("You have provided a quantity over 9999, if you have this much, you really don't need to worry about storing that")
    }

	if err := itemcontroller.AddItem(userId, payload, dbc); err != nil {
		return c.Status(500).SendString("Internal Server Error when trying to update the quantity of the item given")
	}

	return c.SendStatus(200)
}

