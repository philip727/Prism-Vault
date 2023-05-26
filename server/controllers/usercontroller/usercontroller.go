package usercontroller

import (
	"regexp"

	"golang.org/x/crypto/bcrypt"
)

// Error used when the client payload doesn't meet requirements
type PayloadError struct {
    Msg string
}

func (e *PayloadError) Error() string {
    return e.Msg
}


// Checks if the string provided matches a username
func IsUsername(un string) bool {
	re := regexp.MustCompile(`^[A-Za-z0-9_-]{1,35}$`)

	return re.MatchString(un)
}

// Makes sure the string given is an actual email
func IsEmail(e string) bool {
	re := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

	return re.MatchString(e)
}

// Makes sure the password given meets the requirements
func IsPasswordStrong(pw string) bool {
	var (
		lengthCheck = len(pw) > 8
		// Makes sure the string contains at least one upper case char
		uppercaseCheck, _ = regexp.MatchString(`[A-Z]+`, pw)

		// Makes sure it contains at least one lower case char
		lowercaseCheck, _ = regexp.MatchString(`[a-z]+`, pw)

		// Makes sure it contains at least one number
		numberCheck, _ = regexp.MatchString(`\d+`, pw)

		// Makes sure it contains at least one of the special chars
		specialCharCheck, _ = regexp.MatchString(`[@#$%^&*()_+~=\-?<>{}\[\]|\\\/]+`, pw)
	)

	return lengthCheck && uppercaseCheck && lowercaseCheck && numberCheck && specialCharCheck
}

func comparePasswordToHash(pw string, h string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(h), []byte(pw))
    return err == nil
}
