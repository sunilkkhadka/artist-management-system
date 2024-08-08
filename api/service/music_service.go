package service

import (
	"github.com/sunilkkhadka/artist-management-system/model"
	"github.com/sunilkkhadka/artist-management-system/repository"
	"github.com/sunilkkhadka/artist-management-system/request"
)

type MusicServiceI interface {
	CreateMusic(music request.CreateMusicRequest) error
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
