package types

type NewUserPayload struct {
	Username  string `json:"username"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	CPassword string `json:"cpassword"`
}

type LoginPayload struct {
	Identifier string `json:"identifier"`
	Password   string `json:"password"`
}

type WarframeItemPayload struct {
	UniqueName string `json:"unique_name"`
	Quantity   uint16 `json:"quantity"`
}
