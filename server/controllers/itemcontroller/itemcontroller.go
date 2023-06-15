package itemcontroller

import (
	"errors"

	"github.com/philp727/warframe-app-server/models/db"
	"github.com/philp727/warframe-app-server/types"
	"gorm.io/gorm"
)

func AddItem(uid uint32, p types.AddItemPayload, dbc *gorm.DB) error {
	component := db.Component{UserId: uint32(uid), UniqueName: p.UniqueName, Quantity: p.Quantity, ItemName: p.ItemName }

	result := dbc.Table("components").Where("user_id = ? AND unique_name = ?", uid, p.UniqueName).Omit("id", "user_id", "unique_name").Updates(&component)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		dbc.Table("components").Create(&component)
	}

	return nil
}

func GetComponents(uid uint32, p types.GetItemPayload, dbc *gorm.DB) (map[string]uint16, error) {
    strings := make(map[string]uint16)

	for _, c := range p.UniqueNames {
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

func stringInSlice(s string, sl []string) bool {
    for _, e := range sl {
        if e == s {
            return true
        }
    }

    return false
}

func GetAllUserItems(uid uint32, dbc *gorm.DB) ([]string, error) {
    var components []db.Component 
    var itemNames []string

    result := dbc.Table("components").Where("user_id = ?", uid).Find(&components);
    if result.Error != nil {
        return itemNames, result.Error
    }

    for _, c := range components {
        if len(c.ItemName) == 0 || stringInSlice(c.ItemName, itemNames) {
            continue
        }
        itemNames = append(itemNames, c.ItemName) 
    }

    return itemNames, nil    
}
