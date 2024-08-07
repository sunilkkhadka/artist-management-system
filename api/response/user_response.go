package response

import (
	"database/sql"
	"time"
)

type UserResponse struct {
	ID          uint         `json:"id"`
	Email       string       `json:"email"`
	Password    string       `json:"-"`
	Firstname   string       `json:"first_name"`
	Lastname    string       `json:"last_name"`
	Role        string       `json:"role"`
	Phone       uint         `json:"phone"`
	DateOfBirth time.Time    `json:"dob"`
	Gender      string       `json:"gender"`
	Address     string       `json:"address"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   time.Time    `json:"updated_at"`
	DeletedAt   sql.NullTime `json:"deleted_at"`
}

type CollectionResponse struct {
	Collection interface{} `json:"collection"`
	Meta       Meta        `json:"meta"`
}

type Meta struct {
	Amount int `json:"amount"`
}

func CreateUsersCollectionResponse(users []UserResponse) CollectionResponse {
	collection := make([]UserResponse, 0)

	for index := range users {
		collection = append(collection, UserResponse{
			ID:          users[index].ID,
			Email:       users[index].Email,
			Firstname:   users[index].Firstname,
			Lastname:    users[index].Lastname,
			Role:        users[index].Role,
			Phone:       users[index].Phone,
			DateOfBirth: users[index].DateOfBirth,
			Gender:      users[index].Gender,
			Address:     users[index].Address,
			CreatedAt:   users[index].CreatedAt,
			UpdatedAt:   users[index].UpdatedAt,
			DeletedAt:   users[index].DeletedAt,
		},
		)
	}
	return CollectionResponse{Collection: collection, Meta: Meta{Amount: len(collection)}}
}
