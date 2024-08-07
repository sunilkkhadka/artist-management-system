package service

import (
	"time"

	"github.com/sunilkkhadka/artist-management-system/model"
	"github.com/sunilkkhadka/artist-management-system/repository"
	"github.com/sunilkkhadka/artist-management-system/request"
	"github.com/sunilkkhadka/artist-management-system/response"
)

type ArtistServiceI interface {
	CreateArtist(artist request.CreateArtistRequest) error
	GetAllArtists(limit, offset int) ([]response.ArtistResponse, error)
}

type ArtistService struct {
	ArtistRepo repository.ArtistRepositoryI
}

func NewArtistService(artistRepo repository.ArtistRepositoryI) ArtistServiceI {
	return &ArtistService{
		ArtistRepo: artistRepo,
	}
}

func (service *ArtistService) GetAllArtists(limit, offset int) ([]response.ArtistResponse, error) {
	artists, err := service.ArtistRepo.GetAllArtists(limit, offset)
	if err != nil {
		return nil, err
	}

	return artists, nil
}

func (service *ArtistService) CreateArtist(artist request.CreateArtistRequest) error {
	newArtist := model.Artist{
		Name:                   artist.Name,
		DateOfBirth:            time.Now(),
		Gender:                 artist.Gender,
		Address:                artist.Address,
		FirstYearRelease:       artist.FirstYearRelease,
		NumberOfAlbumsReleased: artist.NumberOfAlbumsReleased,
	}

	err := service.ArtistRepo.CreateArtist(newArtist)
	if err != nil {
		return err
	}

	return nil
}
