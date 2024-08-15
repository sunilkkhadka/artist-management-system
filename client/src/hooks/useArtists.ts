import { useMutation, useQuery } from "@tanstack/react-query";

import {
  createArtist,
  fetchArtistById,
  fetchArtists,
  updateArtistById,
} from "../api/api.service";
import { Artist } from "../types/artist.type";

export const useGetArtists = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["artists"],
    queryFn: fetchArtists,
  });

  return { data: data?.data.collection, isLoading, isError };
};

export const useGetArtistById = (id: number) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["artistById", id],
    queryFn: () => fetchArtistById(id),
  });

  return { data: data?.data, isError, isLoading };
};

export const useCreateArtist = () => {
  return useMutation({
    mutationFn: (artist: Artist) => createArtist(artist),
  });
};

export const useUpdateArtistById = () => {
  return useMutation({
    mutationFn: (artist: Artist) => updateArtistById(artist),
  });
};
