package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/philp727/warframe-app-server/models/db"
	"github.com/philp727/warframe-app-server/routes/item"
	"github.com/philp727/warframe-app-server/routes/user"
)

func main() {
	app := fiber.New()

	database, err := db.Connect()
	if err != nil {
		log.Fatal(err)
	}

    user.CreateRoute(app, database)
    item.CreateRoute(app, database)

	log.Fatal(app.Listen(":8080"))
}
