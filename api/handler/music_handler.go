package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sunilkkhadka/artist-management-system/request"
	"github.com/sunilkkhadka/artist-management-system/response"
	"github.com/sunilkkhadka/artist-management-system/service"
)

type MusicHandler struct {
	MusicService service.MusicServiceI
}

func NewMusicHandler(musicService service.MusicServiceI) *MusicHandler {
	return &MusicHandler{
		MusicService: musicService,
	}
}

func (handler *MusicHandler) CreateSongRecord(ctx *gin.Context) {
	var createMusic request.CreateMusicRequest
	if err := ctx.ShouldBindJSON(&createMusic); err != nil {
		response.ErrorResponse(ctx, http.StatusUnprocessableEntity, "required fields are empty")
		return
	}

	if err := handler.MusicService.CreateMusic(createMusic); err != nil {
		response.ErrorResponse(ctx, http.StatusUnprocessableEntity, err.Error())
		return
	}

	response.SuccessResponse(ctx, "Music created successfully")
}
