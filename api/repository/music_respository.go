package repository

import (
	"database/sql"
	"fmt"

	"github.com/sunilkkhadka/artist-management-system/model"
)

type MusicRepositoryI interface {
	CreateMusic(music model.Music) error
}

type MusicRepository struct {
	DB *sql.DB
}

func NewMusicRepository(db *sql.DB) MusicRepositoryI {
	return &MusicRepository{
		DB: db,
	}
}

func (repo *MusicRepository) CreateMusic(music model.Music) error {
	stmt, err := repo.DB.Prepare("INSERT INTO musics (artist_id, title, album_name, genre) VALUES (?, ?, ?, ?)")
	if err != nil {
		return fmt.Errorf("couldn't prepare statement to store music: %v", err)
	}

	_, err = stmt.Exec(music.ArtistId, music.Title, music.AlbumName, music.Genre)
	if err != nil {
		return fmt.Errorf("couldn't create music: %v", err)
	}

	return nil
}
