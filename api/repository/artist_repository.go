package repository

import (
	"database/sql"
	"fmt"

	"github.com/sunilkkhadka/artist-management-system/model"
	"github.com/sunilkkhadka/artist-management-system/response"
)

type ArtistRepositoryI interface {
	DeleteArtistById(id int) error
	CreateArtist(artist model.Artist) error
	GetArtistById(id uint) (*model.Artist, error)
	UpdateArtistById(query string, args []interface{}) error
	GetAllArtists(limit, offset int) ([]response.ArtistResponse, error)
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

func (repo *ArtistRepository) DeleteArtistById(id int) error {
	stmt, err := repo.DB.Prepare("UPDATE artists SET deleted_at = NOW() WHERE id = ?")
	if err != nil {
		return fmt.Errorf("couldn't prepare statement to delete artist: %v", err)
	}

	_, err = stmt.Exec(id)
	if err != nil {
		return fmt.Errorf("couldn't delete artist: %v", err)
	}

	return nil
}

func (repo *ArtistRepository) GetArtistById(id uint) (*model.Artist, error) {
	var artist model.Artist
	stmt, err := repo.DB.Prepare("SELECT * FROM artists WHERE id = ? AND deleted_at IS NULL")
	if err != nil {
		return nil, fmt.Errorf("failed to prepare statement: %w", err)
	}
	defer stmt.Close()

	err = stmt.QueryRow(id).Scan(
		&artist.ID,
		&artist.Name,
		&artist.DateOfBirth,
		&artist.Gender,
		&artist.Address,
		&artist.FirstYearRelease,
		&artist.NumberOfAlbumsReleased,
		&artist.CreatedAt,
		&artist.UpdatedAt,
		&artist.DeletedAt,
	)

	if err != nil && err != sql.ErrNoRows {
		return &model.Artist{}, fmt.Errorf("couldn't scan artist: %v", err)
	}

	return &artist, nil
}

func (repo *ArtistRepository) UpdateArtistById(query string, args []interface{}) error {
	stmt, err := repo.DB.Prepare("UPDATE artists SET " + query + " WHERE id = ?")
	if err != nil {
		return fmt.Errorf("couldn't prepare statement to update the artist: %v", err)
	}

	_, err = stmt.Exec(args...)
	if err != nil {
		return fmt.Errorf("couldn't update artists: %v", err)
	}

	return nil
}
