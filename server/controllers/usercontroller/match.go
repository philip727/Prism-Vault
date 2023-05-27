package usercontroller

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"

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

type SessionToken string

// Creates the ssession id from the user details
func createSessionToken(u db.UnsafeUser) SessionToken {
	beforeString := fmt.Sprint(u.Username, u.Id, time.Now().Unix())
	hash := sha256.Sum256([]byte(beforeString))
    hashString := hex.EncodeToString(hash[:])

	return SessionToken(hashString)
}

func storeSession(t SessionToken, u db.UnsafeUser, dbc *gorm.DB) error {
	expiry := time.Now().Add(time.Hour * 24 * 14).Unix() // 14 day expiry date
    session := &db.Session{UserId: u.Id, Token: string(t), Expiry: expiry}
    
    result := dbc.Table("sessions").Where("user_id = ?", u.Id).Omit("id").Updates(&session);
    if result.Error != nil {
        return result.Error
    }

    if result.RowsAffected == 0 {
        dbc.Table("sessions").Create(&session)
    }

	return nil
}

func MatchInformation(lp types.LoginPayload, dbc *gorm.DB) (SessionToken, error) {
	var user db.UnsafeUser
    var sessionToken SessionToken

	dbs := dbc.Session(&gorm.Session{})

	switch matchIdentifier(lp.Identifier) {
	case NONE:
		return sessionToken, &PayloadError{Msg: "The given identifier is not a username or email"}
	case EMAIL:
		// Checks if the user table contains the email
		err := db.ColumnExists("users", "email", lp.Identifier, dbs)

		if err != nil {
			return sessionToken, &db.ExistsError{Msg: fmt.Sprint("No user exists with the email, ", lp.Identifier)}
		}

		// Finds the user by email
		user = searchUserByCol(lp.Identifier, "email", dbs)
	case USERNAME:
		// Checks if the user table contains the username
		err := db.ColumnExists("users", "username", lp.Identifier, dbs)

		if err != nil {
			return sessionToken, &db.ExistsError{Msg: fmt.Sprint("No user exists with the username, ", lp.Identifier)}
		}

		// Finds the user by username
		user = searchUserByCol(lp.Identifier, "username", dbs)
	}

	if !comparePasswordToHash(lp.Password, user.Password) {
		return sessionToken, &UnauthorizedError{Msg: "The password given is incorrect"}
	}

    sessionToken = createSessionToken(user);
    if err := storeSession(sessionToken, user, dbs); err != nil {
        return sessionToken, err
    }

	return sessionToken,  nil
}
