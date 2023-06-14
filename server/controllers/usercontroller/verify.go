package usercontroller

import (
	"errors"
	"strings"
	"time"

	"github.com/philp727/warframe-app-server/models/db"
	"gorm.io/gorm"
)

func VerifySessionToken(t string, dbc *gorm.DB) (db.User, error) {
	var user db.User
    var session db.Session

	result := dbc.Table("sessions").Where("token = ?", strings.Replace(t, "\"", "", -1)).Take(&session)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return user, &UnauthorizedError{Msg: "The token provided does not match any tokens"}
		}

		return user, result.Error
    }

	if result.RowsAffected == 0 {
		return user, &UnauthorizedError{Msg: "The token provided does not match any tokens"}
	}

    if time.Now().Unix() > session.Expiry {
        return user, &UnauthorizedError{Msg: "The token provided has expired"}
    }

	if err := dbc.Table("users").Where("id = ?", session.UserId).Find(&user).Error; err != nil {
		return user, err
	}

	return user, nil
}
