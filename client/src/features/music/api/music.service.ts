import routes from "../../../routes/routes.data";
import { client } from "../../../shared/api/http.api";
import { Music, MusicsList } from "../music.type";

export const createMusic = async (music: Music) => {
  const response = await client.post(routes.MUSIC, JSON.stringify(music));
  return response;
};

export const getMusicsByArtistId = async (artistId: number) => {
  const response = await client.get<MusicsList>(`${routes.MUSICS}/${artistId}`);
  return response;
};

export const deleteMusicByMusicAndArtistId = async (
  music_id: number,
  artist_id: number
) => {
  const response = await client.patch(
    `${routes.DELETE_MUSIC}/${music_id}/${artist_id}`
  );
  return response;
};
