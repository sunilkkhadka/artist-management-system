package response

import "github.com/sunilkkhadka/artist-management-system/model"

func CreateMusicsCollectionResponse(musics []model.Music) CollectionResponse {
	collection := make([]model.Music, 0)

	for index := range musics {
		collection = append(collection, model.Music{
			ID:        musics[index].ID,
			ArtistId:  musics[index].ArtistId,
			Title:     musics[index].Title,
			AlbumName: musics[index].AlbumName,
			Genre:     musics[index].Genre,
			CreatedAt: musics[index].CreatedAt,
			UpdatedAt: musics[index].UpdatedAt,
			DeletedAt: musics[index].DeletedAt,
		},
		)
	}
	return CollectionResponse{Collection: collection, Meta: Meta{Amount: len(collection)}}
}
