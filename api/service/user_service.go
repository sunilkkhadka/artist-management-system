package service

import (
	"errors"

	"github.com/sunilkkhadka/artist-management-system/model"
	"github.com/sunilkkhadka/artist-management-system/repository"
	"github.com/sunilkkhadka/artist-management-system/request"
	"github.com/sunilkkhadka/artist-management-system/utils/auth"
	"github.com/sunilkkhadka/artist-management-system/utils/encryption"
	"golang.org/x/crypto/bcrypt"
)

type UserServiceI interface {
	CreateUser(req request.RegisterUserRequest, en encryption.Encryptor) error
	LoginUser(req request.LoginRequest) (string, string, error)
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

	if user.ID == 0 {
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
