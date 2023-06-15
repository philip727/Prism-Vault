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

// Compares a string to a hash to see if they match
func ComparePasswordToHash(pw string, h string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(h), []byte(pw))
	return err == nil
}

// Searches for a user by a certain column
func searchUserByCol(idn string, col string, dbc *gorm.DB) db.User {
	var user db.User

	dbc.Table("users").First(&user, fmt.Sprintln(col, " = ?"), idn)

	return user
}

type Identifier int64

const (
	NONE     Identifier = iota
	EMAIL    Identifier = iota
	USERNAME Identifier = iota
)

// Matches the string given to a certain identifier
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

// Creates the session token from the user information and current time
func createSessionToken(u db.User) SessionToken {
	beforeString := fmt.Sprint(u.Username, u.Id, time.Now().Unix())
	hash := sha256.Sum256([]byte(beforeString))
	hashString := hex.EncodeToString(hash[:])

	return SessionToken(hashString)
}

// Stores the session token in the database with an expiry date in unix time
func storeSession(t SessionToken, u db.User, dbc *gorm.DB) error {
	expiry := time.Now().Add(time.Hour * 24 * 14).Unix() // 14 day expiry date
	session := &db.Session{UserId: u.Id, Token: string(t), Expiry: expiry}

	result := dbc.Table("sessions").Where("user_id = ?", u.Id).Omit("id").Updates(&session)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		dbc.Table("sessions").Create(&session)
	}

	return nil
}

type LoginReturn struct {
	User  db.User      `json:"user"`
	Token SessionToken `json:"session_token"`
}

// Matches the information in the db with the login data given
func LoginWithPayload(lp types.LoginPayload, dbc *gorm.DB) (LoginReturn, error) {
	var user db.User
	var sessionToken SessionToken

	switch matchIdentifier(lp.Identifier) {
	case NONE:
		return LoginReturn{user, sessionToken}, &PayloadError{Msg: "The given identifier is not a username or email"}
	case EMAIL:
		// Checks if the user table contains the email
		err := db.ColumnExists("users", "email", lp.Identifier, dbc)

		if err != nil {
			return LoginReturn{}, &db.ExistsError{Msg: fmt.Sprint("No user exists with the email, ", lp.Identifier)}
		}

		// Finds the user by email
		user = searchUserByCol(lp.Identifier, "email", dbc)
	case USERNAME:
		// Checks if the user table contains the username
		err := db.ColumnExists("users", "username", lp.Identifier, dbc)

		if err != nil {
			return LoginReturn{}, &db.ExistsError{Msg: fmt.Sprint("No user exists with the username, ", lp.Identifier)}
		}

		// Finds the user by username
		user = searchUserByCol(lp.Identifier, "username", dbc)
	}

	if !ComparePasswordToHash(lp.Password, user.Password) {
		return LoginReturn{}, &UnauthorizedError{Msg: "The password given is incorrect"}
	}

	sessionToken = createSessionToken(user)
	if err := storeSession(sessionToken, user, dbc); err != nil {
		return LoginReturn{}, err
	}

	return LoginReturn{user.ToSafe(), sessionToken}, nil
}
