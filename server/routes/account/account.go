package account

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/philp727/warframe-app-server/middleware/sessionauth"
	"gorm.io/gorm"
)

func CreateRoute(f *fiber.App, dbc *gorm.DB) {
	item := f.Group("/account")

	item.Use(cors.New(cors.Config{AllowHeaders: "Session-Token, Content-Type, Access-Control-Allow-Origin"}))
	item.Post("/change-password",
		sessionauth.New(sessionauth.Config{DatabaseConnection: dbc}),
		func(c *fiber.Ctx) error {
			return changePassword(c, dbc)
		})
}
