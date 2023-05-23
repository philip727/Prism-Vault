package db

import (
	"errors"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// Connects to the database
func Connect() (*gorm.DB, error) {
    dsn := "root:secretpw@tcp(127.0.0.1:3306)/main"
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    
    if err != nil {
        return nil, errors.New("Failed to connect to db")
    }

    return db, nil
}
