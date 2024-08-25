import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  createArtist,
  fetchArtistById,
  fetchArtists,
  updateArtistById,
} from "../api/api.service";
import { Artist } from "../types/artist.type";
import { useHistory } from "react-router-dom";
import axios from "axios";

export const useGetArtists = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["artists"],
    queryFn: fetchArtists,
  });

  return { data: data?.data.collection, isLoading, isError, refetch };
};

export const useGetArtistById = (id: number) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["artistById", id],
    queryFn: () => fetchArtistById(id),
  });

  return { data: data?.data, isError, isLoading };
};

export const useCreateArtist = () => {
  const history = useHistory();

  return useMutation({
    mutationFn: (artist: Artist) => createArtist(artist),
    onSuccess: () => {
      history.push("/home");
      return toast.success("Artist created successfully");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          return toast.error("You do not have access to create an artist");
        }
      }
    },
  });
};

export const useUpdateArtistById = () => {
  const history = useHistory();

  return useMutation({
    mutationFn: (artist: Artist) => updateArtistById(artist),
    onSuccess: () => {
      history.push("/home");
      return toast.success("Artist updated successfully");
    },
  });
};
