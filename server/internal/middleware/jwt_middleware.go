package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/sunilkkhadka/artist-management-system/internal/response"
	"github.com/sunilkkhadka/artist-management-system/pkg/utils/auth"
	"github.com/sunilkkhadka/artist-management-system/pkg/utils/constants"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHeader := ctx.GetHeader("Authorization")
		if authHeader == "" {
			response.ErrorResponse(ctx, http.StatusNotFound, "Auth header is empty")
			return
		}

		// extract token from header
		token := strings.Split(authHeader, " ")[1]

		// Validate token
		claims, err := auth.ValidateToken(token, []byte(auth.JwtConf.JwtSecret))
		if err != nil {
			response.ErrorResponse(ctx, http.StatusUnauthorized, err.Error())
			return
		}

		// Set claims in the context
		ctx.Set(constants.USER_ID, claims[constants.USER_ID])
		ctx.Set(constants.ROLE, claims[constants.ROLE])

		ctx.Next()
	}
}
