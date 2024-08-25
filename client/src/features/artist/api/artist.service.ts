import routes from "../../../routes/routes.data";
import { client } from "../../../shared/api/http.api";
import { Artist, ArtistsList } from "../artist.type";

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
