package db


type User struct {
	Id       uint32 `json:"id" gorm:"primaryKey"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password,omitempty"`
}

func (u User) ToSafe() User {
	return User{
		Id:       u.Id,
		Username: u.Username,
		Email:    u.Email,
	}
}

type Session struct {
	Id     uint32 `json:"id" gorm:"primaryKey"`
	Token  string `json:"token"`
	Expiry int64  `json:"expiry"`
	UserId uint32 `json:"user_id"`
}
