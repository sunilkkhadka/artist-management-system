import { useMutation, useQuery } from "@tanstack/react-query";

import {
  createMusic,
  deleteMusicByMusicAndArtistId,
  getMusicsByArtistId,
} from "../api/api.service";
import { Music } from "../types/music.type";

export const useCreateMusic = () => {
  return useMutation({
    mutationFn: (music: Music) => createMusic(music),
  });
};

export const useGetMusicsByArtistId = (id: number) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["musicByArtistId", id],
    queryFn: () => getMusicsByArtistId(id),
  });

  return { data: data?.data.collection, isError, isLoading };
};

export const useDeleteMusicById = () => {
  return useMutation({
    mutationFn: ({
      music_id,
      artist_id,
    }: {
      music_id: number;
      artist_id: number;
    }) => deleteMusicByMusicAndArtistId(music_id, artist_id),
  });
};

// export const useCreateArtist = () => {
//     return useMutation({
//       mutationFn: (artist: Artist) => createArtist(artist),
//     });
//   };

// export const useUpdateArtistById = () => {
//   return useMutation({
//     mutationFn: (artist: Artist) => updateArtistById(artist),
//   });
// };
