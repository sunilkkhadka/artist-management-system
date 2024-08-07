package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sunilkkhadka/artist-management-system/request"
	"github.com/sunilkkhadka/artist-management-system/response"
	"github.com/sunilkkhadka/artist-management-system/service"
)

type ArtistHandler struct {
	ArtistService service.ArtistServiceI
}

func NewArtistHandler(artistService service.ArtistServiceI) *ArtistHandler {
	return &ArtistHandler{
		ArtistService: artistService,
	}
}

func (handler *ArtistHandler) GetAllArtists(ctx *gin.Context) {
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

	artists, err := handler.ArtistService.GetAllArtists(limit, offset)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusNotFound, err.Error())
		return
	}

	response.SuccessResponse(ctx, response.CreateArtistsCollectionResponse(artists))
}

func (handler *ArtistHandler) CreateArtist(ctx *gin.Context) {
	var createArtist request.CreateArtistRequest
	if err := ctx.ShouldBindJSON(&createArtist); err != nil {
		response.ErrorResponse(ctx, http.StatusUnprocessableEntity, "required fields are empty")
		return
	}

	if err := handler.ArtistService.CreateArtist(createArtist); err != nil {
		response.ErrorResponse(ctx, http.StatusUnprocessableEntity, err.Error())
		return
	}

	response.SuccessResponse(ctx, "Artist created successfully")
}
