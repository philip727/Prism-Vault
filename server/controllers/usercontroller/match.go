package usercontroller

import (
	"fmt"

	"github.com/philp727/warframe-app-server/models/db"
	"github.com/philp727/warframe-app-server/types"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func comparePasswordToHash(pw string, h string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(h), []byte(pw))
	return err == nil
}

func searchUserByCol(idn string, col string, dbc *gorm.DB) db.UnsafeUser {
	var user db.UnsafeUser

	dbc.Table("users").First(&user, fmt.Sprintln(col, " LIKE ?"), idn)

	return user
}

type Identifier int64

const (
	NONE     Identifier = iota
	EMAIL    Identifier = iota
	USERNAME Identifier = iota
)

func matchIdentifier(idn string) Identifier {
    if IsEmail(idn) {
        return EMAIL
    } else if IsUsername(idn) {
        return USERNAME
    } else {
        return NONE
    }
}

func MatchInformation(lp types.LoginPayload, dbc *gorm.DB) error {
    var user db.UnsafeUser
    dbs := dbc.Session(&gorm.Session{})

    switch matchIdentifier(lp.Identifier) {
    case NONE:
        return &PayloadError{Msg: "The given identifier is not a username or email"}
    case EMAIL:
        // Checks if the user table contains the email
        err := db.ColumnExists("users", "email", lp.Identifier, dbs)

        if err != nil {
            return &db.ExistsError{Msg: fmt.Sprint("No user exists with the email, ", lp.Identifier)}
        }

        // Finds the user by email 
        user = searchUserByCol(lp.Identifier, "email", dbs)
    case USERNAME:
        // Checks if the user table contains the username
        err := db.ColumnExists("users", "username", lp.Identifier, dbs)

        if err != nil {
            return &db.ExistsError{Msg: fmt.Sprint("No user exists with the username, ", lp.Identifier)}
        }

        // Finds the user by username 
        user = searchUserByCol(lp.Identifier, "username", dbs)
    }

    if !comparePasswordToHash(lp.Password, user.Password) {
        return &UnauthorizedError{Msg: "The password given is incorrect"}
    }

	return nil
}
