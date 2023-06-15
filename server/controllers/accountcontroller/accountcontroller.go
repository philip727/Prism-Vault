package accountcontroller

import (
	"errors"

	"github.com/philp727/warframe-app-server/controllers/usercontroller"
	"github.com/philp727/warframe-app-server/models/db"
	"github.com/philp727/warframe-app-server/types"
	"gorm.io/gorm"
)

func UpdatePassword(uid uint32, p types.ChangePasswordPayload, dbc *gorm.DB) error {
	var user db.User

    // Finds the user details
	result := dbc.Table("users").Where("id = ?", uid).Take(&user)
	if result.Error != nil {
		return result.Error
	}

    // Makes sure the hash and previous password from payload match
	if !usercontroller.ComparePasswordToHash(p.PreviousPassword, user.Password) {
		return &usercontroller.UnauthorizedError{Msg: "The previous password given is incorrect"}
	}

	if p.NewPassword != p.ConfirmNewPassword {
		return &usercontroller.PayloadError{Msg: "Passwords do not match"}
	}

	if !usercontroller.IsPasswordStrong(p.NewPassword) {
		return &usercontroller.PayloadError{Msg: "Password does not meet the criteria"}
	}

    // Hashes the new password
    hash, err := usercontroller.HashPassword(p.NewPassword);
    if err != nil {
        return err;
    }

    user.Password = hash;
    // Updates info with new password
	result = dbc.Table("users").Where("id = ?", uid).Omit("id", "username", "email").Updates(&user)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("Error finding user after parsing id, contact a developer")
	}

	return nil
}
