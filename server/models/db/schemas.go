package db

type User interface {
	GetId() uint32
}

type SafeUser struct {
	Id       uint32 `json:"id" gorm:"primaryKey"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

func (u SafeUser) GetId() uint32 {
	return u.Id
}

type UnsafeUser struct {
	Id       uint32 `json:"id" gorm:"primaryKey"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (u UnsafeUser) GetId() uint32 {
	return u.Id
}

type Session struct {
	Id     uint32 `json:"id" gorm:"primaryKey"`
	Token  string `json:"token"`
	Expiry int64  `json:"expiry"`
	UserId uint32 `json:"user_id"`
}
