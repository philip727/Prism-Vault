package users

import (
	"regexp"

	"github.com/philp727/warframe-app-server/models/db"
	"gorm.io/gorm"
)


// Makes sure the string given is an actual email
func IsEmail(e string) bool {
    re := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

    return re.MatchString(e);
}

// Makes sure the password given meets the requirements
func IsPassword(pw string) bool {
	var (
		lengthCheck       = len(pw) > 8
        // Makes sure the string contains at least one upper case char
		uppercaseCheck, _ = regexp.MatchString(`[A-Z]+`, pw)

        // Makes sure it contains at least one lower case char
		lowercaseCheck, _ = regexp.MatchString(`[a-z]+`, pw)

        // Makes sure it contains at least one number
		numberCheck, _    = regexp.MatchString(`\d+`, pw)

        // Makes sure it contains at least one of the special chars
        specialCharCheck, _ = regexp.MatchString(`[@#$%^&*()_+~=\-?<>{}\[\]|\\\/]+`, pw)
	)

    return lengthCheck && uppercaseCheck && lowercaseCheck && numberCheck && specialCharCheck
}

// Interacts with the database to create a user
func InsertUser(dbc *gorm.DB, u db.UnsafeUser) {

}
