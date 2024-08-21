import { useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";

import Modal from "../components/Modal";
import useModal from "../hooks/useModal";
import { useDeleteMusicById, useGetMusicsByArtistId } from "../hooks/useMusic";

const MusicList = () => {
  const { artist_id } = useParams<{ artist_id: string }>();
  const { isOpen, openModal, closeModal } = useModal();
  const [currentMusic, setCurrentMusic] = useState<number>(0);

  const deleteMusicMutation = useDeleteMusicById();

  const {
    data: musicList,
    isError,
    isLoading,
  } = useGetMusicsByArtistId(parseInt(artist_id));

  if (isLoading) {
    return <h1>Loading music list...</h1>;
  }

  if (isError) {
    return <h1>Something went wrong...</h1>;
  }

  const handleDelete = () => {
    deleteMusicMutation.mutate({
      music_id: currentMusic,
      artist_id: parseInt(artist_id),
    });
    closeModal();
  };

  return (
    <section>
      <h1>Musics</h1>
      <NavLink className="create-new" to={`/music/create/${artist_id}`}>
        Create New Music
      </NavLink>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Artist Name</th>
            <th>Music Title</th>
            <th>Album Name</th>
            <th>Genre</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Deleted at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {musicList?.map((music) => (
            <tr key={music.id}>
              <td>{music.id}</td>
              <td>{music.artist_name}</td>
              <td>{music.title}</td>
              <td>{music.album_name}</td>
              <td>{music.genre}</td>
              <td>{music.created_at}</td>
              <td>{music.updated_at?.Time}</td>
              <td>{music.deleted_at?.Time}</td>
              <td>
                <Link to={`/music/edit/${music.id}`}>Edit</Link>
                <p
                  onClick={() => {
                    openModal();
                    setCurrentMusic(parseInt(music.id));
                  }}
                >
                  Delete
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <h2>Are you sure you want to delete this music?</h2>
        <button onClick={handleDelete}>Confirm</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </section>
  );
};

export default MusicList;
