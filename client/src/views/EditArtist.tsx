import { useParams } from "react-router-dom";

import { Artist } from "../types/artist.type";
import ArtistForm from "../components/ArtistForm";
import { getInitialArtistData } from "../data/artist.data";
import { useGetArtistById, useUpdateArtistById } from "../hooks/useArtists";

const EditArtist = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useGetArtistById(parseInt(id));

  const initialArtistData = getInitialArtistData(data);

  const updateArtistMutation = useUpdateArtistById();

  console.log(initialArtistData);

  const handleUpdatedArtist = (artist: Artist) => {
    updateArtistMutation.mutate(artist);
  };

  return (
    <ArtistForm
      title="Edit Artist"
      initialArtistData={initialArtistData}
      handleArtist={handleUpdatedArtist}
    />
  );
};

export default EditArtist;
