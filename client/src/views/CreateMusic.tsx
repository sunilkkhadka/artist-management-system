import { Music } from "../types/music.type";
import MusicForm from "../components/MusicForm";
import { useCreateMusic } from "../hooks/useMusic";
import { initialMusicData } from "../data/music.data";

const CreateMusic = () => {
  const createMusicMutation = useCreateMusic();

  const handleCreateMusic = (music: Music) => {
    createMusicMutation.mutate(music);
  };

  return (
    <MusicForm
      title="Create Music"
      initialMusicData={initialMusicData}
      handleMusic={handleCreateMusic}
    />
  );
};

export default CreateMusic;
