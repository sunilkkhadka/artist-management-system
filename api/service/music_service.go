package service

import (
	"errors"
	"strings"

	"github.com/sunilkkhadka/artist-management-system/model"
	"github.com/sunilkkhadka/artist-management-system/repository"
	"github.com/sunilkkhadka/artist-management-system/request"
)

type MusicServiceI interface {
	DeleteMusicById(musicId, artistId int) error
	CreateMusic(music request.CreateMusicRequest) error
	GetAllMusic(artist_id, limit, offset int) ([]model.Music, error)
	UpdateMusicById(musicId, artistId int, music request.UpdateMusicRequest) error
}

type MusicService struct {
	MusicRepo repository.MusicRepositoryI
}

func NewMusicService(musicRepo repository.MusicRepositoryI) MusicServiceI {
	return &MusicService{
		MusicRepo: musicRepo,
	}
}

func (service *MusicService) CreateMusic(music request.CreateMusicRequest) error {
	newMusic := model.Music{
		ArtistId:  music.ArtistId,
		Title:     music.Title,
		AlbumName: music.AlbumName,
		Genre:     music.Genre,
	}

	err := service.MusicRepo.CreateMusic(newMusic)
	if err != nil {
		return err
	}

	return nil
}

func (service *MusicService) GetAllMusic(artist_id, limit, offset int) ([]model.Music, error) {
	artists, err := service.MusicRepo.GetAllMusics(artist_id, limit, offset)
	if err != nil {
		return nil, err
	}

	return artists, nil
}

func (service *MusicService) DeleteMusicById(musicId, artistId int) error {
	err := service.MusicRepo.DeleteMusicById(musicId, artistId)
	if err != nil {
		return err
	}

	return nil
}

func (service *MusicService) UpdateMusicById(musicId, artistId int, music request.UpdateMusicRequest) error {
	currentMusic, err := service.MusicRepo.GetMusicByArtistId(uint(musicId), uint(artistId))
	if err != nil {
		return err
	}

	if currentMusic.ID == 0 || currentMusic.DeletedAt.Valid {
		return errors.New("music doesn't exist")
	}

	var query []string
	var args []interface{}

	if music.Title != nil {
		query = append(query, "title = ?")
		args = append(args, *&music.Title)
	}

	if music.AlbumName != nil {
		query = append(query, "album_name = ?")
		args = append(args, *music.AlbumName)
	}

	if music.Genre != nil {
		query = append(query, "genre = ?")
		args = append(args, *&music.Genre)
	}

	query = append(query, "updated_at = ?")
	args = append(args, music.UpdatedAt)

	args = append(args, musicId, artistId)
	finalQuery := strings.Join(query, ", ")

	err = service.MusicRepo.UpdateMusicById(finalQuery, args)
	if err != nil {
		return err
	}

	return nil
}
