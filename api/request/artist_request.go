package request

import (
	"database/sql"
	"time"
)

type CreateArtistRequest struct {
	Name                   string       `json:"name" binding:"required"`
	DateOfBirth            time.Time    `json:"dob"`
	Gender                 string       `json:"gender"`
	Address                string       `json:"address"`
	FirstYearRelease       uint         `json:"first_year_release"`
	NumberOfAlbumsReleased uint         `json:"no_of_albums_released"`
	CreatedAt              time.Time    `json:"created_at"`
	UpdatedAt              sql.NullTime `json:"updated_at"`
	DeletedAt              sql.NullTime `json:"deleted_at"`
}

type UpdateArtistRequest struct {
	Name                   *string       `json:"name" binding:"required"`
	DateOfBirth            *time.Time    `json:"dob"`
	Gender                 *string       `json:"gender"`
	Address                *string       `json:"address"`
	FirstYearRelease       *uint         `json:"first_year_release"`
	NumberOfAlbumsReleased *uint         `json:"no_of_albums_released"`
	UpdatedAt              *sql.NullTime `json:"updated_at"`
}
