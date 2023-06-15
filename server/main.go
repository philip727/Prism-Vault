package main

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/joho/godotenv"
	"github.com/philp727/warframe-app-server/models/db"
	"github.com/philp727/warframe-app-server/routes/account"
	"github.com/philp727/warframe-app-server/routes/item"
	"github.com/philp727/warframe-app-server/routes/user"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	app := fiber.New()

    // Rate limiter
	app.Use(limiter.New(limiter.Config{
		Next: func(c *fiber.Ctx) bool {
			return c.IP() == "127.0.0.1"
		},
		Max:        20,
		Expiration: 30 * time.Second,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.Get("x-forwarded-for")
		},
	}))

	database, err := db.Connect()
	if err != nil {
		log.Fatal(err)
	}

	user.CreateRoute(app, database)
	item.CreateRoute(app, database)
    account.CreateRoute(app, database)

	log.Fatal(app.Listen(":8080"))
}
