package service

import (
	"fmt"

	"github.com/sunilkkhadka/artist-management-system/model"
	"github.com/sunilkkhadka/artist-management-system/repository"
	"github.com/sunilkkhadka/artist-management-system/request"
	"github.com/sunilkkhadka/artist-management-system/utils/encryption"
)

type UserServiceI interface {
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
		return fmt.Errorf("user already exists")
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
