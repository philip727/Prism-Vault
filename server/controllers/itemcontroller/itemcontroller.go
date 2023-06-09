package itemcontroller

import (
	"errors"

	"github.com/philp727/warframe-app-server/models/db"
	"github.com/philp727/warframe-app-server/types"
	"gorm.io/gorm"
)

func AddItem(uid uint32, itemp types.AddItemPayload, dbc *gorm.DB) error {
	component := db.Component{UserId: uint32(uid), UniqueName: itemp.UniqueName, Quantity: itemp.Quantity}

	result := dbc.Table("components").Where("user_id = ? AND unique_name = ?", uid, itemp.UniqueName).Omit("id", "user_id", "unique_name").Updates(&component)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		dbc.Table("components").Create(&component)
	}

	return nil
}

func GetComponents(uid uint32, itemp types.GetItemPayload, dbc *gorm.DB) (map[string]uint16, error) {
    strings := make(map[string]uint16)

	for _, c := range itemp.UniqueNames {
		var component db.Component
		result := dbc.Table("components").Where("user_id = ? AND unique_name = ?", uid, c).Take(&component)
		if result.Error != nil {
			if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
                return strings, result.Error
			}

            strings[c] = 0
		}

        strings[c] = component.Quantity
	}

	return strings, nil
}
