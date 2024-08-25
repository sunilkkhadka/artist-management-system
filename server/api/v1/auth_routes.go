package v1

import (
	"github.com/sunilkkhadka/artist-management-system/internal/handler"
	"github.com/sunilkkhadka/artist-management-system/internal/middleware"
	"github.com/sunilkkhadka/artist-management-system/internal/server"
)

func AuthRoutes(server *server.Server, userHandler *handler.UserHandler) {
	v1 := server.Gin.Group("/api/v1")
	v1.POST("/login", middleware.ActivityLogs(server.DB), userHandler.LoginHandler)
	v1.POST("/refresh", middleware.ActivityLogs(server.DB), userHandler.RefreshHandler)
	v1.POST("/register", middleware.ActivityLogs(server.DB), userHandler.RegisterUserHandler)

	v1.POST("/logout", middleware.AuthMiddleware(), middleware.ActivityLogs(server.DB), userHandler.LogoutHandler)
}
