package handler

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sunilkkhadka/artist-management-system/email"
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

	email.SendRegisterEmail(registerRequest.Firstname, registerRequest.Email)

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

	email.SendLoginEmail("User", loginRequest.Email, time.Now().Format("2006-01-02 15:04:05"), ctx.Request.UserAgent())
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

func (handler *UserHandler) GetAllUsers(ctx *gin.Context) {
	pageQuery := ctx.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageQuery)
	if err != nil || page < 1 {
		response.ErrorResponse(ctx, http.StatusBadRequest, "invalid page number")
		return
	}

	limitQuery := ctx.DefaultQuery("limit", "5")
	limit, err := strconv.Atoi(limitQuery)
	if err != nil || limit < 1 {
		response.ErrorResponse(ctx, http.StatusBadRequest, "invalid limit number")
		return
	}

	offset := (page - 1) * limit

	users, err := handler.UserService.GetAllUsers(limit, offset)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusNotFound, err.Error())
		return
	}

	response.SuccessResponse(ctx, response.CreateUsersCollectionResponse(users))
}

func (handler *UserHandler) DeleteUserById(ctx *gin.Context) {

	id := ctx.Param("id")
	if id == "" {
		response.ErrorResponse(ctx, http.StatusNotFound, "user id not found")
		return
	}

	userId, err := strconv.Atoi(id)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusNotFound, "couldn't convert id to a number")
		return
	}

	if err := handler.UserService.DeleteUserById(userId); err != nil {
		response.ErrorResponse(ctx, http.StatusBadGateway, "cannot delete user")
		return
	}

	response.SuccessResponse(ctx, "User deleted successfully")
}

func (handler *UserHandler) UpdateUserById(ctx *gin.Context) {
	var user request.UpdateUserRequest
	if err := ctx.ShouldBindJSON(&user); err != nil {
		response.ErrorResponse(ctx, http.StatusUnprocessableEntity, err.Error())
		return
	}

	id := ctx.Param("id")
	if id == "" {
		response.ErrorResponse(ctx, http.StatusNotFound, "user id not found")
		return
	}

	userId, err := strconv.Atoi(id)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusNotFound, "couldn't convert id to a number")
		return
	}

	if err := handler.UserService.UpdateUserById(userId, user); err != nil {
		response.ErrorResponse(ctx, http.StatusBadGateway, err.Error())
		return
	}

	response.SuccessResponse(ctx, "User updated successfully")
}
