package service

import (
	"errors"
	"strings"
	"time"

	"github.com/sunilkkhadka/artist-management-system/model"
	"github.com/sunilkkhadka/artist-management-system/repository"
	"github.com/sunilkkhadka/artist-management-system/request"
	"github.com/sunilkkhadka/artist-management-system/response"
)

type ArtistServiceI interface {
	DeleteArtistById(id int) error
	CreateArtist(artist request.CreateArtistRequest) error
	UpdateArtistById(id int, artist request.UpdateArtistRequest) error
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

func (service *ArtistService) DeleteArtistById(id int) error {
	err := service.ArtistRepo.DeleteArtistById(id)
	if err != nil {
		return err
	}

	return nil
}

func (service *ArtistService) UpdateArtistById(id int, artist request.UpdateArtistRequest) error {
	currentArtist, err := service.ArtistRepo.GetArtistById(uint(id))
	if err != nil {
		return err
	}

	if currentArtist.ID == 0 || currentArtist.DeletedAt.Valid {
		return errors.New("artist doesn't exist")
	}

	var query []string
	var args []interface{}

	if artist.Name != nil {
		query = append(query, "name = ?")
		args = append(args, *artist.Name)
	}

	if artist.DateOfBirth != nil {
		query = append(query, "dob = ?")
		args = append(args, *artist.DateOfBirth)
	}

	if artist.Gender != nil {
		query = append(query, "gender = ?")
		args = append(args, *&artist.Gender)
	}

	if artist.Address != nil {
		query = append(query, "address = ?")
		args = append(args, *artist.Address)
	}

	if artist.FirstYearRelease != nil {
		query = append(query, "first_year_release = ?")
		args = append(args, *artist.FirstYearRelease)
	}

	if artist.NumberOfAlbumsReleased != nil {
		query = append(query, "no_of_albums_released = ?")
		args = append(args, *artist.NumberOfAlbumsReleased)
	}

	query = append(query, "updated_at = ?")
	args = append(args, artist.UpdatedAt)

	args = append(args, id)
	finalQuery := strings.Join(query, ", ")

	err = service.ArtistRepo.UpdateArtistById(finalQuery, args)
	if err != nil {
		return err
	}

	return nil
}
