import { Artist } from "../artist.type";
import ArtistForm from "../components/ArtistForm";
import { useCreateArtist } from "../hooks/useArtists";
import { initialArtistData } from "../artist.data";

const CreateArtist = () => {
  const createArtistMutation = useCreateArtist();

  const handleCreateArtist = (artist: Artist) => {
    createArtistMutation.mutate(artist);
  };

  return (
    <ArtistForm
      title="Create Artist"
      initialArtistData={initialArtistData}
      handleArtist={handleCreateArtist}
    />
  );
};

export default CreateArtist;
