package repository

import (
	"database/sql"
)

type UserRepositoryI interface {
}

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepositoryI {
	return &UserRepository{
		db: db,
	}
}

// func (repo *UserRepository) GetUserByEmail(email string) model.User {
// }
