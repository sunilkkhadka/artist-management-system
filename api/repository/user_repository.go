package repository

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/sunilkkhadka/artist-management-system/model"
)

type UserRepositoryI interface {
	CreateUser(user *model.User) error
	GetUserByEmail(email string) (*model.User, error)
	Logout(refreshToken string, expiresAt time.Time) error
	GetBlacklistedTokenByToken(token string, expiresAt *time.Time) error
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
		user.Role = "artist"
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

func (repo *UserRepository) Logout(refreshToken string, expiresAt time.Time) error {
	stmt, err := repo.db.Prepare("INSERT INTO blacklisted_tokens (token, expires_at) VALUES (?,?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(refreshToken, expiresAt)
	if err != nil {
		return errors.New("cannot insert into the database")
	}

	return nil
}

func (repo *UserRepository) GetBlacklistedTokenByToken(token string, expiresAt *time.Time) error {
	stmt, err := repo.db.Prepare("SELECT expires_at FROM blacklisted_tokens WHERE token = ?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	err = stmt.QueryRow(token).Scan(&expiresAt)
	if err != nil {
		return errors.New("token not found in the database")
	}

	return nil
}
