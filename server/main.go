package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/philp727/warframe-app-server/models/db"
)

func main() {
	app := fiber.New()

	database, err := db.Connect()
	if err != nil {
		log.Fatal(err)
	}

	log.Fatal(app.Listen(":8080"))
}
