import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  createMusic,
  deleteMusicByMusicAndArtistId,
  getMusicsByArtistId,
} from "../api/api.service";
import { Music } from "../music.type";
import axios from "axios";

export const useCreateMusic = () => {
  const history = useHistory();

  return useMutation({
    mutationFn: (music: Music) => createMusic(music),
    onSuccess: () => {
      // history.push(`/artist/music/${}`)
      history.goBack();
      return toast.success("Music created successfully");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          return toast.error("You aren't allowed to perform that action");
        }
      }
    },
  });
};

export const useGetMusicsByArtistId = (id: number) => {
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["musicByArtistId", id],
    queryFn: () => getMusicsByArtistId(id),
  });

  return { data: data?.data.collection, isError, isLoading, refetch };
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
