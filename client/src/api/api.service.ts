import { client } from "./http.api";
import routes from "../data/routes.data";
import { Music, MusicsList } from "../types/music.type";
import { User, UserListProps } from "../types/users.type";
import { Artist, ArtistsList } from "../types/artist.type";

export const fetchUsers = async (page = 1, perPage = 5) => {
  const response = await client.get<UserListProps>(
    `${routes.USERS}?page=${page}&per_page=${perPage}`
  );

  return response;
};

export const fetchUserById = async (id: number) => {
  const response = await client.get<User>(`${routes.USER}/${id}`);

  return response;
};

export const updateUserById = async (user: User) => {
  const response = await client.patch(
    `${routes.USER}/${user.id}`,
    JSON.stringify(user)
  );
  return response;
};

export const deleteUserById = async (id: number) => {
  const response = await client.patch(`${routes.DELETE_USER}/${id}`);
  return response;
};

export const createArtist = async (artist: Artist) => {
  const response = await client.post(routes.ARTIST, JSON.stringify(artist));
  return response;
};

export const fetchArtists = async () => {
  const response = await client.get<ArtistsList>(routes.ARTISTS);

  return response;
};

export const fetchArtistById = async (id: number) => {
  const response = await client.get<Artist>(`${routes.ARTIST}/${id}`);

  return response;
};

export const updateArtistById = async (artist: Artist) => {
  const response = await client.patch(
    `${routes.ARTIST}/${artist.id}`,
    JSON.stringify(artist)
  );
  return response;
};

export const deleteArtistById = async (id: number) => {
  const response = await client.patch(`${routes.DELETE_ARTIST}/${id}`);
  return response;
};

export const createUser = async (user: User) => {
  const response = await client.post(routes.USER, JSON.stringify(user));
  return response;
};

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
