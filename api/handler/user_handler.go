package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sunilkkhadka/artist-management-system/request"
	"github.com/sunilkkhadka/artist-management-system/response"
	"github.com/sunilkkhadka/artist-management-system/service"
	"github.com/sunilkkhadka/artist-management-system/utils/auth"
	"github.com/sunilkkhadka/artist-management-system/utils/constants"
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

func (handler *UserHandler) HealthcheckHandler(ctx *gin.Context) {
	response.SuccessResponse(ctx, "Server is running...")
}

func (handler *UserHandler) RegisterUserHandler(context *gin.Context) {
	var registerRequest request.RegisterUserRequest
	if err := context.ShouldBindJSON(&registerRequest); err != nil {
		response.ErrorResponse(context, http.StatusUnprocessableEntity, "required fields are empty")
		return
	}

	if err := registerRequest.Validate(); err != nil {
		response.ErrorResponse(context, http.StatusUnprocessableEntity, err.Error())
		return
	}

	if err := handler.UserService.CreateUser(registerRequest, encryption.NewBcryptEncoder(bcrypt.DefaultCost)); err != nil {
		response.ErrorResponse(context, http.StatusUnprocessableEntity, err.Error())
		return
	}

	response.SuccessResponse(context, "User registered successfully")
}

func (handler *UserHandler) LoginHandler(ctx *gin.Context) {
	var loginRequest request.LoginRequest
	if err := ctx.ShouldBindJSON(&loginRequest); err != nil {
		response.ErrorResponse(ctx, http.StatusUnprocessableEntity, "required fields are empty")
		return
	}

	if err := loginRequest.Validate(); err != nil {
		response.ErrorResponse(ctx, http.StatusUnprocessableEntity, err.Error())
		return
	}

	accessToken, refreshToken, err := handler.UserService.LoginUser(loginRequest)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusNotFound, err.Error())
		return
	}

	ctx.SetCookie(constants.REFRESH_TOKEN, refreshToken, 60*60*24*auth.JwtConf.JwtRefreshTime, "/", "localhost", false, true)

	response.SuccessResponse(ctx, map[string]any{
		"token": accessToken,
	})
}

func (handler *UserHandler) RefreshHandler(ctx *gin.Context) {
	refreshToken, err := ctx.Cookie(constants.REFRESH_TOKEN)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusUnauthorized, "Refresh token not found")
		return
	}

	err = handler.UserService.GetBlacklistedTokenByToken(refreshToken)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusUnauthorized, err.Error())
		return
	}

	claims, err := auth.ValidateToken(refreshToken, []byte(auth.JwtConf.JwtSecret))
	if err != nil {
		response.ErrorResponse(ctx, http.StatusUnauthorized, "Invalid refresh token")
		return
	}

	userId := claims[constants.USER_ID].(float64)
	userRole := claims[constants.ROLE].(string)

	accessToken, newRefreshToken, err := auth.GenerateToken(uint(userId), userRole)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	ctx.SetCookie(constants.REFRESH_TOKEN, newRefreshToken, 60*60*24*auth.JwtConf.JwtRefreshTime, "/", "localhost", false, true)

	response.SuccessResponse(ctx, map[string]any{
		"token": accessToken,
	})
}

func (handler *UserHandler) LogoutHandler(ctx *gin.Context) {
	refreshToken, err := ctx.Cookie(constants.REFRESH_TOKEN)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusUnauthorized, "Refresh token not found")
		return
	}

	claims, err := auth.ValidateToken(refreshToken, []byte(auth.JwtConf.JwtSecret))
	if err != nil {
		response.ErrorResponse(ctx, http.StatusUnauthorized, "Invalid refresh token")
		return
	}

	expiryTime := int64(claims[constants.EXPIRES_AT].(float64))
	err = handler.UserService.LogoutUser(refreshToken, time.Unix(expiryTime, 0))
	if err != nil {
		response.ErrorResponse(ctx, http.StatusUnauthorized, "Cannot logout")
		return
	}

	ctx.SetCookie(constants.REFRESH_TOKEN, "", -1, "/", "localhost", false, true)

	response.SuccessResponse(ctx, "Logged out successfully!")
}
