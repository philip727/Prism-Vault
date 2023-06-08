package itemcontroller

import (
	"github.com/philp727/warframe-app-server/models/db"
	"github.com/philp727/warframe-app-server/types"
	"gorm.io/gorm"
)

func AddItem(uid uint32, itemp types.WarframeItemPayload, dbc *gorm.DB) error {
    component := db.Component{UserId: uint32(uid) , UniqueName: itemp.UniqueName, Quantity: itemp.Quantity }

	result := dbc.Table("components").Where("user_id = ? AND unique_name = ?", uid, itemp.UniqueName).Omit("id", "user_id", "unique_name").Updates(&component)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		dbc.Table("components").Create(&component)
	}

	return nil
}
