package server

import (
	"github.com/sunilkkhadka/artist-management-system/handler"
	"github.com/sunilkkhadka/artist-management-system/middleware"
	"github.com/sunilkkhadka/artist-management-system/repository"
	"github.com/sunilkkhadka/artist-management-system/service"
	"github.com/sunilkkhadka/artist-management-system/utils/constants"
)

func ConfigureRoutes(server *Server) {

	// Repository
	userRepo := repository.NewUserRepository(server.DB)
	artistRepo := repository.NewArtistRepository(server.DB)

	// Service
	userService := service.NewUserService(userRepo)
	artistService := service.NewArtistService(artistRepo)

	// Handler
	userHandler := handler.NewUserHandler(userService)
	artistHandler := handler.NewArtistHandler(artistService)

	// Routes
	v1 := server.Gin.Group("/v1")
	v1.POST("/login", middleware.ActivityLogs(server.DB), userHandler.LoginHandler)
	v1.POST("/logout", middleware.ActivityLogs(server.DB), userHandler.LogoutHandler)
	v1.POST("/refresh", middleware.ActivityLogs(server.DB), userHandler.RefreshHandler)
	v1.POST("/register", middleware.ActivityLogs(server.DB), userHandler.RegisterUserHandler)

	// Authenticated Routes
	v1.Use(middleware.AuthMiddleware()).Use(middleware.ActivityLogs(server.DB))
	v1.GET("/users", userHandler.GetAllUsers)
	v1.PATCH("/user/:id", userHandler.UpdateUserById)
	v1.PATCH("/user/delete/:id", userHandler.DeleteUserById)

	v1.POST("/artist", middleware.RoleAccess(constants.ARTIST_MANAGER), artistHandler.CreateArtist)
	v1.PATCH("/artist/:id", middleware.RoleAccess(constants.ARTIST_MANAGER), artistHandler.UpdateArtistById)
	v1.PATCH("/artist/delete/:id", middleware.RoleAccess(constants.ARTIST_MANAGER), artistHandler.DeleteArtistById)
	v1.GET("/artists", middleware.RoleAccess(constants.SUPER_ADMIN, constants.ARTIST_MANAGER), artistHandler.GetAllArtists)

	v1.GET("/healthcheck", userHandler.HealthcheckHandler)
}
