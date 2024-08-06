package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sunilkkhadka/artist-management-system/utils/constants"
)

type Error struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func Response(context *gin.Context, statusCode int, data interface{}, responseType string) {
	context.Set(constants.ACTIVITY_LOG, data)

	if responseType == constants.ERROR {
		context.AbortWithStatusJSON(statusCode, data)
		return
	}

	if responseType == constants.SUCCESS {
		context.JSON(statusCode, data)
		return
	}
}

func SuccessResponse(context *gin.Context, data interface{}) {
	Response(context, http.StatusOK, data, constants.SUCCESS)
}

func ErrorResponse(context *gin.Context, statusCode int, message string) {
	Response(context, statusCode, Error{Code: statusCode, Message: message}, constants.ERROR)
}
