package request

import (
	"time"

	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/go-ozzo/ozzo-validation/is"
)

type RegisterUserRequest struct {
	Email       string    `json:"email" binding:"required" example:"example@gmail.com"`
	Password    string    `json:"password" binding:"required"`
	Firstname   string    `json:"first_name"`
	Lastname    string    `json:"last_name"`
	Role        string    `json:"role"`
	Phone       uint      `json:"phone"`
	DateOfBirth time.Time `json:"dob"`
	Gender      string    `json:"gender" binding:"required" example:"m"`
	Address     string    `json:"address"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	DeletedAt   time.Time `json:"deleted_at"`
}

func (ru RegisterUserRequest) Validate() error {
	return validation.ValidateStruct(&ru,
		validation.Field(&ru.Email, is.Email),
		validation.Field(&ru.Password, validation.Length(8, 23)),
		validation.Field(&ru.Gender, validation.Required),
	)
}
