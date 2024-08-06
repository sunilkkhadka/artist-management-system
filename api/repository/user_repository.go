package repository

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/sunilkkhadka/artist-management-system/model"
)

type UserRepositoryI interface {
	GetUserByEmail(email string) (*model.User, error)
	CreateUser(user *model.User) error
}

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepositoryI {
	return &UserRepository{
		db: db,
	}
}

func (repo *UserRepository) GetUserByEmail(email string) (*model.User, error) {
	var user model.User
	stmt, err := repo.db.Prepare("SELECT * FROM users WHERE email = ?")
	if err != nil {
		return nil, fmt.Errorf("failed to prepare statement: %w", err)
	}
	defer stmt.Close()

	err = stmt.QueryRow(email).Scan(
		&user.ID,
		&user.Firstname,
		&user.Lastname,
		&user.Email,
		&user.Password,
		&user.Role,
		&user.Phone,
		&user.DateOfBirth,
		&user.Gender,
		&user.Address,
		&user.CreatedAt,
		&user.UpdatedAt,
		&user.DeletedAt,
	)

	if err != nil && err != sql.ErrNoRows {
		return &model.User{}, fmt.Errorf("couldn't scan user")
	}

	return &user, nil
}

func (repo *UserRepository) CreateUser(user *model.User) error {

	if user.Role == "" {
		user.Role = "super_admin"
	}

	stmt, err := repo.db.Prepare("INSERT INTO users (first_name, last_name, email, password_hash, role, phone, dob, gender, address, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,NOW(),NOW())")
	if err != nil {
		return err
	}
	defer stmt.Close()

	result, err := stmt.Exec(user.Firstname, user.Lastname, user.Email, user.Password, user.Role, user.Phone, time.Now(), user.Gender, user.Address)
	if err != nil {
		return err
	}

	lastInsertId, err := result.LastInsertId()
	if err != nil {
		return err
	}

	user.ID = uint(lastInsertId)

	return nil
}
