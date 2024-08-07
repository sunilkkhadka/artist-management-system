package repository

import (
	"database/sql"
	"fmt"

	"github.com/sunilkkhadka/artist-management-system/model"
	"github.com/sunilkkhadka/artist-management-system/response"
)

type ArtistRepositoryI interface {
	GetAllArtists(limit, offset int) ([]response.ArtistResponse, error)
	CreateArtist(artist model.Artist) error
}

type ArtistRepository struct {
	DB *sql.DB
}

func NewArtistRepository(db *sql.DB) ArtistRepositoryI {
	return &ArtistRepository{
		DB: db,
	}
}

func (repo *ArtistRepository) GetAllArtists(limit, offset int) ([]response.ArtistResponse, error) {
	stmt, err := repo.DB.Prepare("SELECT * FROM artists WHERE deleted_at IS NULL LIMIT ? OFFSET ?")
	if err != nil {
		return nil, fmt.Errorf("couldn't prepare statement to get all artists: %v", err)
	}

	rows, err := stmt.Query(limit, offset)
	if err != nil {
		return nil, fmt.Errorf("couldn't query artists: %v", err)
	}

	var artists []response.ArtistResponse
	for rows.Next() {
		var user response.ArtistResponse
		err := rows.Scan(&user.ID, &user.Name, &user.DateOfBirth, &user.Gender, &user.Address, &user.FirstYearRelease, &user.NumberOfAlbumsReleased, &user.CreatedAt, &user.UpdatedAt, &user.DeletedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row : %v", err)
		}
		artists = append(artists, user)
	}

	return artists, nil
}

func (repo *ArtistRepository) CreateArtist(artist model.Artist) error {
	stmt, err := repo.DB.Prepare("INSERT INTO artists (name, dob, gender, address, first_year_release, no_of_albums_released) VALUES (?, ?, ?, ?, ?, ?)")
	if err != nil {
		return fmt.Errorf("couldn't prepare statement to store artist: %v", err)
	}

	_, err = stmt.Exec(artist.Name, artist.DateOfBirth, artist.Gender, artist.Address, artist.FirstYearRelease, artist.NumberOfAlbumsReleased)
	if err != nil {
		return fmt.Errorf("couldn't create artist: %v", err)
	}

	return nil
}
