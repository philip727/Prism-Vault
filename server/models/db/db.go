package db

import (
	"errors"
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// Error used when the client payload doesn't meet requirements
type ExistsError struct {
    Msg string
}

func (e *ExistsError) Error() string {
    return e.Msg
}

// Connects to the database
func Connect() (*gorm.DB, error) {
    dsn := "root:secretpw@tcp(127.0.0.1:3306)/main"
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    
    if err != nil {
        return nil, errors.New("Failed to connect to db")
    }

    return db, nil
}

// Checks if a column in a table, contains a value
func ColumnContains(tbl string, col string, val string, dbs *gorm.DB) (error) {
    count := int64(0)
    result := dbs.Table(tbl).Where(fmt.Sprint(col, " LIKE ?"), val).Count(&count)

    if result.Error != nil {
        return result.Error
    }

    if count > 0 {
        return &ExistsError{Msg: fmt.Sprint(col, ", ", val, " already in use")}
    }

    return nil
}

// Checks if a column in a table, contains a value
func ColumnExists(tbl string, col string, val string, dbs *gorm.DB) (error) {
    count := int64(0)
    result := dbs.Table(tbl).Where(fmt.Sprint(col, " LIKE ?"), val).Count(&count)

    if result.Error != nil {
        return result.Error
    }

    if count == 0 {
        return &ExistsError{Msg: fmt.Sprint(col, ", ", val, " does not exist")}
    }

    return nil
}
