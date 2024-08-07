package response

import (
	"database/sql"
	"time"
)

type ArtistResponse struct {
	ID                     uint         `json:"id"`
	Name                   string       `json:"name"`
	DateOfBirth            time.Time    `json:"dob"`
	Gender                 string       `json:"gender"`
	Address                string       `json:"address"`
	FirstYearRelease       uint         `json:"first_year_release"`
	NumberOfAlbumsReleased uint         `json:"no_of_albums_released"`
	CreatedAt              time.Time    `json:"created_at"`
	UpdatedAt              sql.NullTime `json:"updated_at"`
	DeletedAt              sql.NullTime `json:"deleted_at"`
}

func CreateArtistsCollectionResponse(artists []ArtistResponse) CollectionResponse {
	collection := make([]ArtistResponse, 0)

	for index := range artists {
		collection = append(collection, ArtistResponse{
			ID:                     artists[index].ID,
			DateOfBirth:            artists[index].DateOfBirth,
			Gender:                 artists[index].Gender,
			Address:                artists[index].Address,
			FirstYearRelease:       artists[index].FirstYearRelease,
			NumberOfAlbumsReleased: artists[index].NumberOfAlbumsReleased,
			CreatedAt:              artists[index].CreatedAt,
			UpdatedAt:              artists[index].UpdatedAt,
			DeletedAt:              artists[index].DeletedAt,
		},
		)
	}
	return CollectionResponse{Collection: collection, Meta: Meta{Amount: len(collection)}}
}
