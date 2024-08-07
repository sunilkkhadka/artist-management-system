package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sunilkkhadka/artist-management-system/response"
	"github.com/sunilkkhadka/artist-management-system/utils/constants"
)

func RoleAccess(allowedRoles ...string) gin.HandlerFunc {
	return func(ctx *gin.Context) {

		role, exists := ctx.Get(constants.ROLE)
		if !exists {
			response.ErrorResponse(ctx, http.StatusUnauthorized, "User role is undefined")
			return
		}

		for _, allowedRole := range allowedRoles {
			if allowedRole == role {
				ctx.Next()
				return
			}
		}

		response.ErrorResponse(ctx, http.StatusUnauthorized, "User is not allowed to access this role")
	}
}
