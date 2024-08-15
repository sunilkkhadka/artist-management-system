// import { useState } from "react";
import ArtistForm from "../components/ArtistForm";
import { initialArtistData } from "../data/artist.data";
import { Artist } from "../types/artist.type";
import { useCreateArtist } from "../hooks/useArtists";

const CreateArtist = () => {
  const createArtistMutation = useCreateArtist();

  const handleCreateArtist = (artist: Artist) => {
    createArtistMutation.mutate(artist);
  };

  return (
    <ArtistForm
      initialArtistData={initialArtistData}
      handleCreateArtist={handleCreateArtist}
    />
  );
};

export default CreateArtist;
