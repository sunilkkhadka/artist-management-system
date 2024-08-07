package service

import (
	"errors"
	"strings"
	"time"

	"github.com/sunilkkhadka/artist-management-system/model"
	"github.com/sunilkkhadka/artist-management-system/repository"
	"github.com/sunilkkhadka/artist-management-system/request"
	"github.com/sunilkkhadka/artist-management-system/response"
	"github.com/sunilkkhadka/artist-management-system/utils/auth"
	"github.com/sunilkkhadka/artist-management-system/utils/encryption"
	"golang.org/x/crypto/bcrypt"
)

type UserServiceI interface {
	DeleteUserById(id int) error
	GetBlacklistedTokenByToken(token string) error
	LogoutUser(refreshToken string, expiresAt time.Time) error
	LoginUser(req request.LoginRequest) (string, string, error)
	UpdateUserById(id int, user request.UpdateUserRequest) error
	GetAllUsers(limit, offset int) ([]response.UserResponse, error)
	CreateUser(req request.RegisterUserRequest, en encryption.Encryptor) error
}

type UserService struct {
	UserRepo repository.UserRepositoryI
}

func NewUserService(userRepo repository.UserRepositoryI) UserServiceI {
	return &UserService{
		UserRepo: userRepo,
	}
}

func (service UserService) CreateUser(req request.RegisterUserRequest, en encryption.Encryptor) error {
	user, err := service.UserRepo.GetUserByEmail(req.Email)
	if err != nil {
		return err
	}

	if user.ID != 0 {
		return errors.New("user already exists")
	}

	var encryptedPassword string
	encryptedPassword, err = en.Encrypt(req.Password)

	if err != nil {
		return err
	}

	newUser := model.User{
		Firstname:   req.Firstname,
		Lastname:    req.Lastname,
		Email:       req.Email,
		Password:    encryptedPassword,
		Role:        req.Role,
		Phone:       req.Phone,
		DateOfBirth: req.DateOfBirth,
		Gender:      req.Gender,
		Address:     req.Address,
	}

	err = service.UserRepo.CreateUser(&newUser)
	if err != nil {
		return err
	}

	return nil
}

func (service *UserService) LoginUser(req request.LoginRequest) (string, string, error) {
	user, err := service.UserRepo.GetUserByEmail(req.Email)
	if err != nil {
		return "", "", err
	}

	if user.ID == 0 || user.DeletedAt.Valid {
		return "", "", errors.New("user doesn't exist")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return "", "", errors.New("password doesn't match")
	}

	accessToken, refreshToken, err := auth.GenerateToken(user.ID, user.Role)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

func (service *UserService) GetBlacklistedTokenByToken(token string) error {
	var expiresAt time.Time
	err := service.UserRepo.GetBlacklistedTokenByToken(token, &expiresAt)
	if err != nil {
		return err
	}

	if time.Now().Before(expiresAt) {
		return errors.New("Refresh token is already expired")
	}

	return nil
}

func (service *UserService) LogoutUser(refreshToken string, expiresAt time.Time) error {
	err := service.UserRepo.Logout(refreshToken, expiresAt)
	if err != nil {
		return err
	}

	return nil
}

func (service *UserService) GetAllUsers(limit, offset int) ([]response.UserResponse, error) {
	users, err := service.UserRepo.GetAllUsers(limit, offset)
	if err != nil {
		return nil, err
	}

	return users, nil
}

func (service *UserService) DeleteUserById(id int) error {
	err := service.UserRepo.DeleteUserById(id)
	if err != nil {
		return err
	}

	return nil
}

func (service *UserService) UpdateUserById(id int, user request.UpdateUserRequest) error {
	currentUser, err := service.UserRepo.GetUserById(uint(id))
	if err != nil {
		return err
	}

	if currentUser.ID == 0 || currentUser.DeletedAt.Valid {
		return errors.New("user doesn't exist")
	}

	var query []string
	var args []interface{}

	if user.Firstname != nil {
		query = append(query, "first_name = ?")
		args = append(args, *user.Firstname)
	}

	if user.Lastname != nil {
		query = append(query, "last_name = ?")
		args = append(args, *user.Lastname)
	}

	if user.Email != nil {
		query = append(query, "email = ?")
		args = append(args, *user.Email)
	}

	if user.Password != nil {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(*user.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		query = append(query, "password = ?")
		args = append(args, hashedPassword)
	}

	if user.Role != nil {
		query = append(query, "role = ?")
		args = append(args, *user.Role)
	}

	if user.Phone != nil {
		query = append(query, "phone = ?")
		args = append(args, *user.Phone)
	}

	if user.DateOfBirth != nil {
		query = append(query, "dob = ?")
		args = append(args, *user.DateOfBirth)
	}

	if user.Gender != nil {
		query = append(query, "gender = ?")
		args = append(args, *user.Gender)
	}

	if user.Address != nil {
		query = append(query, "address = ?")
		args = append(args, *user.Address)
	}

	query = append(query, "updated_at = ?")
	args = append(args, user.UpdatedAt)

	args = append(args, id)
	finalQuery := strings.Join(query, ", ")

	err = service.UserRepo.UpdateUserById(finalQuery, args)
	if err != nil {
		return err
	}

	return nil
}
