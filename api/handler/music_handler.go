package handler

import (
	"net/http"
	"strconv"

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

func (handler *MusicHandler) GetAllSongs(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		response.ErrorResponse(ctx, http.StatusNotFound, "artist id not found")
		return
	}

	artistId, err := strconv.Atoi(id)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusNotFound, "couldn't convert id to a number")
		return
	}

	pageQuery := ctx.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageQuery)
	if err != nil || page < 1 {
		response.ErrorResponse(ctx, http.StatusBadRequest, "invalid page number")
		return
	}

	limitQuery := ctx.DefaultQuery("limit", "5")
	limit, err := strconv.Atoi(limitQuery)
	if err != nil || limit < 1 {
		response.ErrorResponse(ctx, http.StatusBadRequest, "invalid limit number")
		return
	}

	offset := (page - 1) * limit

	musics, err := handler.MusicService.GetAllMusic(artistId, limit, offset)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusNotFound, err.Error())
		return
	}

	response.SuccessResponse(ctx, response.CreateMusicsCollectionResponse(musics))
}

func (handler *MusicHandler) DeleteMusicById(ctx *gin.Context) {
	musicIdStr := ctx.Param("musicId")
	if musicIdStr == "" {
		response.ErrorResponse(ctx, http.StatusNotFound, "music id not found")
		return
	}

	artistIdStr := ctx.Param("artistId")
	if artistIdStr == "" {
		response.ErrorResponse(ctx, http.StatusNotFound, "artist id not found")
		return
	}

	musicId, err := strconv.Atoi(musicIdStr)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusNotFound, "couldn't convert id to a number")
		return
	}

	artistId, err := strconv.Atoi(artistIdStr)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusNotFound, "couldn't convert id to a number")
		return
	}

	if err := handler.MusicService.DeleteMusicById(musicId, artistId); err != nil {
		response.ErrorResponse(ctx, http.StatusBadGateway, "cannot delete music")
		return
	}

	response.SuccessResponse(ctx, "Artist deleted successfully")
}

func (handler *MusicHandler) UpdateMusicById(ctx *gin.Context) {
	var updateMusic request.UpdateMusicRequest
	if err := ctx.ShouldBindJSON(&updateMusic); err != nil {
		response.ErrorResponse(ctx, http.StatusUnprocessableEntity, "required fields are empty")
		return
	}

	musicIdStr := ctx.Param("musicId")
	if musicIdStr == "" {
		response.ErrorResponse(ctx, http.StatusNotFound, "music id not found")
		return
	}

	artistIdStr := ctx.Param("artistId")
	if artistIdStr == "" {
		response.ErrorResponse(ctx, http.StatusNotFound, "artist id not found")
		return
	}

	musicId, err := strconv.Atoi(musicIdStr)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusNotFound, "couldn't convert id to a number")
		return
	}

	artistId, err := strconv.Atoi(artistIdStr)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusNotFound, "couldn't convert id to a number")
		return
	}

	if err := handler.MusicService.UpdateMusicById(musicId, artistId, updateMusic); err != nil {
		response.ErrorResponse(ctx, http.StatusBadGateway, err.Error())
		return
	}

	response.SuccessResponse(ctx, "Music updated successfully")
}
