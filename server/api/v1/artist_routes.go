package v1

import (
	"github.com/sunilkkhadka/artist-management-system/internal/handler"
	"github.com/sunilkkhadka/artist-management-system/internal/middleware"
	"github.com/sunilkkhadka/artist-management-system/internal/server"
	"github.com/sunilkkhadka/artist-management-system/pkg/utils/constants"
)

func ArtistRoutes(server *server.Server, artistHandler *handler.ArtistHandler) {

	v1 := server.Gin.Group("/api/v1")

	v1.Use(middleware.AuthMiddleware()).Use(middleware.ActivityLogs(server.DB))

	v1.POST("/artist", middleware.RoleAccess(constants.ARTIST_MANAGER), artistHandler.CreateArtist)
	v1.GET("/artist/:id", middleware.RoleAccess(constants.ARTIST_MANAGER), artistHandler.GetArtistById)
	v1.PATCH("/artist/:id", middleware.RoleAccess(constants.ARTIST_MANAGER), artistHandler.UpdateArtistById)
	v1.PATCH("/artist/delete/:id", middleware.RoleAccess(constants.ARTIST_MANAGER), artistHandler.DeleteArtistById)
	v1.GET("/artists", middleware.RoleAccess(constants.SUPER_ADMIN, constants.ARTIST_MANAGER), artistHandler.GetAllArtists)

}
