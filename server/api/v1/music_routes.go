package v1

import (
	"github.com/sunilkkhadka/artist-management-system/internal/handler"
	"github.com/sunilkkhadka/artist-management-system/internal/middleware"
	"github.com/sunilkkhadka/artist-management-system/internal/server"
	"github.com/sunilkkhadka/artist-management-system/pkg/utils/constants"
)

func MusicRoutes(server *server.Server, musicHandler *handler.MusicHandler) {

	v1 := server.Gin.Group("/api/v1")

	v1.Use(middleware.AuthMiddleware()).Use(middleware.ActivityLogs(server.DB))

	v1.POST("/music", middleware.RoleAccess(constants.ARTIST), musicHandler.CreateSongRecord)
	v1.GET("/musics/:id", middleware.RoleAccess(constants.SUPER_ADMIN, constants.ARTIST, constants.ARTIST_MANAGER), musicHandler.GetAllSongs)
	v1.PATCH("/music/:musicId/:artistId", middleware.RoleAccess(constants.ARTIST), musicHandler.UpdateMusicById)
	v1.PATCH("/music/delete/:musicId/:artistId", middleware.RoleAccess(constants.ARTIST), musicHandler.DeleteMusicById)
}
