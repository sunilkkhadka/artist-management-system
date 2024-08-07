package model

import (
	"database/sql"
	"time"
)

type User struct {
	ID          uint         `json:"id"`
	Firstname   string       `json:"first_name"`
	Lastname    string       `json:"last_name"`
	Email       string       `json:"email"`
	Password    string       `json:"password"`
	Role        string       `json:"role"`
	Phone       uint         `json:"phone"`
	DateOfBirth time.Time    `json:"dob"`
	Gender      string       `json:"gender"`
	Address     string       `json:"address"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   time.Time    `json:"updated_at"`
	DeletedAt   sql.NullTime `json:"deleted_at"`
}
