package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sunilkkhadka/artist-management-system/request"
	"github.com/sunilkkhadka/artist-management-system/response"
	"github.com/sunilkkhadka/artist-management-system/service"
	"github.com/sunilkkhadka/artist-management-system/utils/encryption"
	"golang.org/x/crypto/bcrypt"
)

type UserHandler struct {
	UserService service.UserServiceI
}

func NewUserHandler(userService service.UserServiceI) *UserHandler {
	return &UserHandler{
		UserService: userService,
	}
}

func (handler *UserHandler) HealthcheckHandler(context *gin.Context) {
	context.JSON(200, map[string]any{
		"message": "Server is running..",
	})
}

func (handler *UserHandler) RegisterUserHandler(context *gin.Context) {
	var registerUser request.RegisterUserRequest
	if err := context.ShouldBindJSON(&registerUser); err != nil {
		response.ErrorResponse(context, http.StatusUnprocessableEntity, "required fields are empty")
		return
	}

	if err := registerUser.Validate(); err != nil {
		response.ErrorResponse(context, http.StatusUnprocessableEntity, err.Error())
		return
	}

	if err := handler.UserService.CreateUser(registerUser, encryption.NewBcryptEncoder(bcrypt.DefaultCost)); err != nil {
		response.ErrorResponse(context, http.StatusUnprocessableEntity, err.Error())
		return
	}

	response.SuccessResponse(context, "User registered successfully")
}
