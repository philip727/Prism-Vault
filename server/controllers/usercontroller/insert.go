package usercontroller

import (
	"github.com/philp727/warframe-app-server/models/db"
	"github.com/philp727/warframe-app-server/types"
	"gorm.io/gorm"
)

// Interacts with the database to create a user
func InsertUser(dbc *gorm.DB, nu types.NewUserPayload) error {
    
	if !IsUsername(nu.Username) {
		return &PayloadError{Msg: "Invalid username"}
	}

	if !IsEmail(nu.Email) {
		return &PayloadError{Msg: "Invalid email"}
	}

	if nu.Password != nu.CPassword {
		return &PayloadError{Msg: "Passwords do not match"}
	}

	if !IsPasswordStrong(nu.Password) || !IsPasswordStrong(nu.CPassword) {
		return &PayloadError{Msg: "Password does not meet the criteria"}
	}

    dbs := dbc.Session(&gorm.Session{})
    err := db.ColumnContains("users", "username", nu.Username, dbs)

    if err != nil {
        return err
    }

    err = db.ColumnContains("users", "email", nu.Email, dbs)
    if err != nil {
        return err
    }

	return nil
}
