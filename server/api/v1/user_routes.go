package v1

import (
	"github.com/sunilkkhadka/artist-management-system/internal/handler"
	"github.com/sunilkkhadka/artist-management-system/internal/middleware"
	"github.com/sunilkkhadka/artist-management-system/internal/server"
	"github.com/sunilkkhadka/artist-management-system/pkg/utils/constants"
)

func UserRoutes(server *server.Server, userHandler *handler.UserHandler) {
	v1 := server.Gin.Group("/api/v1")

	v1.Use(middleware.AuthMiddleware()).Use(middleware.ActivityLogs(server.DB))
	v1.GET("/users", middleware.RoleAccess(constants.SUPER_ADMIN), userHandler.GetAllUsers)
	v1.GET("/user/:id", middleware.RoleAccess(constants.SUPER_ADMIN), userHandler.GetUserById)
	v1.POST("/user", middleware.RoleAccess(constants.SUPER_ADMIN), userHandler.CreateUser)
	v1.PATCH("/user/:id", middleware.RoleAccess(constants.SUPER_ADMIN), userHandler.UpdateUserById)
	v1.PATCH("/user/delete/:id", middleware.RoleAccess(constants.SUPER_ADMIN), userHandler.DeleteUserById)
}
