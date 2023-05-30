package usercontroller

import (
	"github.com/philp727/warframe-app-server/models/db"
	"gorm.io/gorm"
)

func VerifySessionToken(t string, dbc *gorm.DB) (db.User, error) {
	var user db.User
	var tokenResult struct {
		UserId uint32 `json:"user_id"`
	}

	dbs := dbc.Session(&gorm.Session{})
    if err := dbs.Table("sessions").Where("token = ?", t).Scan(&tokenResult).Error; err != nil {
        return user, &UnauthorizedError{Msg: "The token provided does not match any tokens"}
    }

    if err := dbs.Table("users").Where("id = ?", tokenResult.UserId).Find(&user).Error; err != nil {
        return user, err
    }

    return user, nil
}
