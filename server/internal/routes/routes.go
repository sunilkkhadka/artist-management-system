package routes

import (
	v1 "github.com/sunilkkhadka/artist-management-system/api/v1"
	"github.com/sunilkkhadka/artist-management-system/internal/handler"
	"github.com/sunilkkhadka/artist-management-system/internal/repository"
	"github.com/sunilkkhadka/artist-management-system/internal/server"
	"github.com/sunilkkhadka/artist-management-system/internal/service"
)

func ConfigureRoutes(server *server.Server) {
	// Repository
	userRepo := repository.NewUserRepository(server.DB)
	artistRepo := repository.NewArtistRepository(server.DB)
	musicRepo := repository.NewMusicRepository(server.DB)

	// Service
	userService := service.NewUserService(userRepo)
	artistService := service.NewArtistService(artistRepo)
	musicService := service.NewMusicService(musicRepo)

	// Handler
	userHandler := handler.NewUserHandler(userService)
	artistHandler := handler.NewArtistHandler(artistService)
	musicHandler := handler.NewMusicHandler(musicService)

	v1.AuthRoutes(server, userHandler)
	v1.UserRoutes(server, userHandler)
	v1.ArtistRoutes(server, artistHandler)
	v1.MusicRoutes(server, musicHandler)

	// Routes
	// v1 := server.Gin.Group("/v1")
	// v1.POST("/login", middleware.ActivityLogs(server.DB), userHandler.LoginHandler)
	// v1.POST("/logout", middleware.ActivityLogs(server.DB), userHandler.LogoutHandler)
	// v1.POST("/refresh", middleware.ActivityLogs(server.DB), userHandler.RefreshHandler)
	// v1.POST("/register", middleware.ActivityLogs(server.DB), userHandler.RegisterUserHandler)

	// Authenticated Routes
	// v1.Use(middleware.AuthMiddleware()).Use(middleware.ActivityLogs(server.DB))
	// v1.GET("/users", middleware.RoleAccess(constants.SUPER_ADMIN), userHandler.GetAllUsers)
	// v1.GET("/user/:id", middleware.RoleAccess(constants.SUPER_ADMIN), userHandler.GetUserById)
	// v1.POST("/user", middleware.RoleAccess(constants.SUPER_ADMIN), userHandler.CreateUser)
	// v1.PATCH("/user/:id", middleware.RoleAccess(constants.SUPER_ADMIN), userHandler.UpdateUserById)
	// v1.PATCH("/user/delete/:id", middleware.RoleAccess(constants.SUPER_ADMIN), userHandler.DeleteUserById)

	// v1.POST("/artist", middleware.RoleAccess(constants.ARTIST_MANAGER), artistHandler.CreateArtist)
	// v1.GET("/artist/:id", middleware.RoleAccess(constants.ARTIST_MANAGER), artistHandler.GetArtistById)
	// v1.PATCH("/artist/:id", middleware.RoleAccess(constants.ARTIST_MANAGER), artistHandler.UpdateArtistById)
	// v1.PATCH("/artist/delete/:id", middleware.RoleAccess(constants.ARTIST_MANAGER), artistHandler.DeleteArtistById)
	// v1.GET("/artists", middleware.RoleAccess(constants.SUPER_ADMIN, constants.ARTIST_MANAGER), artistHandler.GetAllArtists)

	// v1.POST("/music", middleware.RoleAccess(constants.ARTIST), musicHandler.CreateSongRecord)
	// v1.GET("/musics/:id", middleware.RoleAccess(constants.SUPER_ADMIN, constants.ARTIST, constants.ARTIST_MANAGER), musicHandler.GetAllSongs)
	// v1.PATCH("/music/:musicId/:artistId", middleware.RoleAccess(constants.ARTIST), musicHandler.UpdateMusicById)
	// v1.PATCH("/music/delete/:musicId/:artistId", middleware.RoleAccess(constants.ARTIST), musicHandler.DeleteMusicById)

	server.Gin.GET("/healthcheck", userHandler.HealthcheckHandler)
}
