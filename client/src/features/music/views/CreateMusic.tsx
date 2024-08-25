import { Music } from "../music.type";
import MusicForm from "../components/MusicForm";
import { useCreateMusic } from "../hooks/useMusic";
import { initialMusicData } from "../music.data";

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
