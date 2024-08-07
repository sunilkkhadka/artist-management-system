package server

import (
	"github.com/sunilkkhadka/artist-management-system/handler"
	"github.com/sunilkkhadka/artist-management-system/middleware"
	"github.com/sunilkkhadka/artist-management-system/repository"
	"github.com/sunilkkhadka/artist-management-system/service"
)

func ConfigureRoutes(server *Server) {

	// Repository
	userRepo := repository.NewUserRepository(server.DB)

	// Service
	userService := service.NewUserService(userRepo)

	// Handler
	userHandler := handler.NewUserHandler(userService)

	// Routes
	v1 := server.Gin.Group("/v1")
	v1.POST("/login", userHandler.LoginHandler)
	v1.POST("/logout", userHandler.LogoutHandler)
	v1.POST("/refresh", userHandler.RefreshHandler)
	v1.POST("/register", userHandler.RegisterUserHandler)

	// Authenticated Routes
	v1.Use(middleware.AuthMiddleware())
	v1.GET("/healthcheck", userHandler.HealthcheckHandler)
}
