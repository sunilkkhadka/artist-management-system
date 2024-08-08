package request

import (
	"database/sql"
	"time"
)

type CreateMusicRequest struct {
	ArtistId  uint         `json:"artist_id" binding:"required"`
	Title     string       `json:"title" binding:"required"`
	AlbumName string       `json:"album_name"`
	Genre     string       `json:"genre"`
	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt sql.NullTime `json:"updated_at"`
	DeletedAt sql.NullTime `json:"deleted_at"`
}

type UpdateMusicRequest struct {
	ArtistId  uint         `json:"artist_id"`
	Title     string       `json:"title"`
	AlbumName string       `json:"album_name"`
	Genre     string       `json:"genre"`
	UpdatedAt sql.NullTime `json:"updated_at"`
}
