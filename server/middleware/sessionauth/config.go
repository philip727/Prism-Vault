package sessionauth

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type Config struct {
	Next               func(c *fiber.Ctx) bool
	DatabaseConnection *gorm.DB
}

var ConfigDefault = Config{
	Next:               nil,
	DatabaseConnection: nil,
}

func configDefault(config ...Config) Config {
	if len(config) < 1 {
		return ConfigDefault
	}

	cfg := config[0]

    return cfg;
}
