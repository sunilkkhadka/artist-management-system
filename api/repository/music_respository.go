package repository

import (
	"database/sql"
	"fmt"

	"github.com/sunilkkhadka/artist-management-system/model"
)

type MusicRepositoryI interface {
	CreateMusic(music model.Music) error
	DeleteMusicById(musicId, artistId int) error
	UpdateMusicById(query string, args []interface{}) error
	GetMusicByArtistId(musicId, artistId uint) (*model.Music, error)
	GetAllMusics(artist_id, limit, offset int) ([]model.Music, error)
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

func (repo *MusicRepository) GetAllMusics(artist_id, limit, offset int) ([]model.Music, error) {
	stmt, err := repo.DB.Prepare("SELECT musics.id, musics.artist_id, musics.title, musics.album_name, musics.genre, artists.name, musics.created_at, musics.updated_at, musics.deleted_at FROM musics INNER JOIN artists ON musics.artist_id = artists.id WHERE musics.artist_id = ? AND musics.deleted_at IS NULL LIMIT ? OFFSET ?")
	if err != nil {
		return nil, fmt.Errorf("couldn't prepare statement to get all musics: %v", err)
	}

	rows, err := stmt.Query(artist_id, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("couldn't query musics: %v", err)
	}

	var musics []model.Music
	for rows.Next() {
		var music model.Music
		err := rows.Scan(&music.ID, &music.ArtistId, &music.Title, &music.AlbumName, &music.Genre, &music.ArtistName, &music.CreatedAt, &music.UpdatedAt, &music.DeletedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row : %v", err)
		}
		musics = append(musics, music)
	}

	return musics, nil
}

func (repo *MusicRepository) GetMusicByArtistId(musicId, artistId uint) (*model.Music, error) {
	var music model.Music
	stmt, err := repo.DB.Prepare("SELECT * FROM musics WHERE id = ? AND artist_id = ? AND deleted_at IS NULL")
	if err != nil {
		return nil, fmt.Errorf("failed to prepare statement: %w", err)
	}
	defer stmt.Close()

	err = stmt.QueryRow(musicId, artistId).Scan(
		&music.ID,
		&music.ArtistId,
		&music.Title,
		&music.AlbumName,
		&music.Genre,
		&music.CreatedAt,
		&music.UpdatedAt,
		&music.DeletedAt,
	)

	if err != nil && err != sql.ErrNoRows {
		return &model.Music{}, fmt.Errorf("couldn't scan artist: %v", err)
	}

	return &music, nil
}

func (repo *MusicRepository) DeleteMusicById(musicId, artistId int) error {
	stmt, err := repo.DB.Prepare("UPDATE musics SET deleted_at = NOW() WHERE id = ? AND artist_id = ?")
	if err != nil {
		return fmt.Errorf("couldn't prepare statement to delete music: %v", err)
	}

	_, err = stmt.Exec(musicId, artistId)
	if err != nil {
		return fmt.Errorf("couldn't delete music: %v", err)
	}

	return nil
}

func (repo *MusicRepository) UpdateMusicById(query string, args []interface{}) error {
	stmt, err := repo.DB.Prepare("UPDATE musics SET " + query + " WHERE id = ? AND artist_id = ?")
	if err != nil {
		return fmt.Errorf("couldn't prepare statement to update the music: %v", err)
	}

	_, err = stmt.Exec(args...)
	if err != nil {
		return fmt.Errorf("couldn't update musics: %v", err)
	}

	return nil
}
