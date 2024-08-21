package model

import (
	"database/sql"
	"time"
)

type Music struct {
	ID         uint         `json:"id"`
	ArtistId   uint         `json:"artist_id" `
	Title      string       `json:"title" `
	AlbumName  string       `json:"album_name"`
	Genre      string       `json:"genre"`
	ArtistName string       `json:"artist_name"`
	CreatedAt  time.Time    `json:"created_at"`
	UpdatedAt  sql.NullTime `json:"updated_at"`
	DeletedAt  sql.NullTime `json:"deleted_at"`
}
