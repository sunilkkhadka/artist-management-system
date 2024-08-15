import { client } from "./http.api";
import routes from "../data/routes.data";
import { User, UserList } from "../types/users.type";
import { Artist, ArtistsList } from "../types/artist.type";

export const fetchUsers = async () => {
  const response = await client.get<UserList>(routes.USERS);

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
