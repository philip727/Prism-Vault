package usercontroller

import (
	"github.com/philp727/warframe-app-server/models/db"
	"github.com/philp727/warframe-app-server/types"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// Hashes the password using bcrypt
func HashPassword(pw string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(pw), 12)
    return string(bytes), err
}

// Interacts with the database to create a user
func InsertUser(dbc *gorm.DB, p types.NewUserPayload) error {
    
	if !IsUsername(p.Username) {
		return &PayloadError{Msg: "Invalid username"}
	}

	if !IsEmail(p.Email) {
		return &PayloadError{Msg: "Invalid email"}
	}

	if p.Password != p.CPassword {
		return &PayloadError{Msg: "Passwords do not match"}
	}

	if !IsPasswordStrong(p.Password) || !IsPasswordStrong(p.CPassword) {
		return &PayloadError{Msg: "Password does not meet the criteria"}
	}

    err := db.ColumnContains("users", "username", p.Username, dbc)
    if err != nil {
        return err
    }

    err = db.ColumnContains("users", "email", p.Email, dbc)
    if err != nil {
        return err
    }

    hash, err := HashPassword(p.Password);
    if err != nil {
        return err
    }

    result := dbc.Table("users").Omit("id").Create(&db.User{
        Username: p.Username,
        Email: p.Email,
        Password: hash,
    })

    if result.Error != nil {
        return result.Error
    }

	return nil
}
