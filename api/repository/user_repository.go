package repository

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/sunilkkhadka/artist-management-system/model"
	"github.com/sunilkkhadka/artist-management-system/response"
)

type UserRepositoryI interface {
	DeleteUserById(id int) error
	CreateUser(user *model.User) error
	GetUserById(id uint) (*model.User, error)
	GetUserByEmail(email string) (*model.User, error)
	UpdateUserById(query string, args []interface{}) error
	Logout(refreshToken string, expiresAt time.Time) error
	GetAllUsers(limit, offset int) ([]response.UserResponse, error)
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
	stmt, err := repo.db.Prepare("SELECT * FROM users WHERE email = ? AND deleted_at IS NULL")
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

func (repo *UserRepository) GetUserById(id uint) (*model.User, error) {
	var user model.User
	stmt, err := repo.db.Prepare("SELECT * FROM users WHERE id = ? AND deleted_at IS NULL")
	if err != nil {
		return nil, fmt.Errorf("failed to prepare statement: %w", err)
	}
	defer stmt.Close()

	err = stmt.QueryRow(id).Scan(
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
		return &model.User{}, fmt.Errorf("couldn't scan user: %v", err)
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

func (repo *UserRepository) GetAllUsers(limit, offset int) ([]response.UserResponse, error) {
	stmt, err := repo.db.Prepare("SELECT * FROM users WHERE deleted_at IS NULL LIMIT ? OFFSET ?")
	if err != nil {
		return nil, fmt.Errorf("couldn't prepare statement to get all users: %v", err)
	}

	rows, err := stmt.Query(limit, offset)
	if err != nil {
		return nil, fmt.Errorf("couldn't query users: %v", err)
	}

	var users []response.UserResponse
	for rows.Next() {
		var user response.UserResponse
		err := rows.Scan(&user.ID, &user.Firstname, &user.Lastname, &user.Email, &user.Password, &user.Role, &user.Phone, &user.DateOfBirth, &user.Gender, &user.Address, &user.CreatedAt, &user.UpdatedAt, &user.DeletedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row : %v", err)
		}
		users = append(users, user)
	}

	return users, nil
}

func (repo *UserRepository) DeleteUserById(id int) error {
	stmt, err := repo.db.Prepare("UPDATE users SET deleted_at = NOW() WHERE id = ?")
	if err != nil {
		return fmt.Errorf("couldn't prepare statement to delete user: %v", err)
	}

	_, err = stmt.Exec(id)
	if err != nil {
		return fmt.Errorf("couldn't delete user: %v", err)
	}

	return nil
}

func (repo *UserRepository) UpdateUserById(query string, args []interface{}) error {
	stmt, err := repo.db.Prepare("UPDATE users SET " + query + " WHERE id = ?")
	if err != nil {
		return fmt.Errorf("couldn't prepare statement to update the user: %v", err)
	}

	_, err = stmt.Exec(args...)
	if err != nil {
		return fmt.Errorf("couldn't update user: %v", err)
	}

	return nil
}
