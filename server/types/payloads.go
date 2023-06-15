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

type AddItemPayload struct {
	UniqueName string `json:"unique_name"`
	ItemName   string `json:"item_name"`
	Quantity   uint16 `json:"quantity"`
}

type GetItemPayload struct {
	UniqueNames []string `json:"unique_names"`
}

type ChangePasswordPayload struct {
	PreviousPassword   string `json:"previous_password"`
	NewPassword        string `json:"new_password"`
	ConfirmNewPassword string `json:"confirm_new_password"`
}
