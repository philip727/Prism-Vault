package item

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	//"github.com/philp727/warframe-app-server/controllers/itemcontroller"
	"github.com/philp727/warframe-app-server/middleware/sessionauth"

	//"github.com/philp727/warframe-app-server/types"
	"gorm.io/gorm"
)

func CreateRoute(f *fiber.App, dbc *gorm.DB) {
	item := f.Group("/item")

	item.Use(cors.New(cors.Config{AllowHeaders: "Session-Token, Content-Type, Access-Control-Allow-Origin"}))
	item.Post("/add",
		sessionauth.New(sessionauth.Config{DatabaseConnection: dbc}),
		func(c *fiber.Ctx) error {
			return addItem(c, dbc)
		})

	item.Post("/get",
		sessionauth.New(sessionauth.Config{DatabaseConnection: dbc}),
		func(c *fiber.Ctx) error {
			return getItemComponents(c, dbc)
		})
}
