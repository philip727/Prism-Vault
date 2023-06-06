package usercontroller

import (
	"errors"
	"strings"

	"github.com/philp727/warframe-app-server/models/db"
	"gorm.io/gorm"
)

func VerifySessionToken(t string, dbc *gorm.DB) (db.User, error) {
	var user db.User
	var payload struct {
		UserId string `json:"user_id"`
		Token  string `json:"token"`
	}

	dbs := dbc.Session(&gorm.Session{})
	result := dbs.Table("sessions").Where("token = ?", strings.Replace(t, "\"", "", -1)).Take(&payload)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return user, &UnauthorizedError{Msg: "The token provided does not match any tokens"}
		}

		return user, result.Error
    }

	if result.RowsAffected == 0 {
		return user, &UnauthorizedError{Msg: "The token provided does not match any tokens"}
	}

	if err := dbs.Table("users").Where("id = ?", payload.UserId).Find(&user).Error; err != nil {
		return user, err
	}

	return user, nil
}
