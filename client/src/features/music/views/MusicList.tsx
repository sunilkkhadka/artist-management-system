import { useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";

import useModal from "../../../shared/hooks/useModal";
import DataTable, { TableColumn } from "react-data-table-component";

import { useDeleteMusicById, useGetMusicsByArtistId } from "../hooks/useMusic";
import MusicListLayout from "../layouts/MusicLayout";
import { Music } from "../music.type";
import { CiExport } from "react-icons/ci";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";
import { Modal } from "reactstrap";
import { FButton } from "../../../shared/components/inputs";
import { useAuth } from "../../auth/hooks/useAuth";

const MusicList = () => {
  const auth = useAuth();
  const { artist_id } = useParams<{ artist_id: string }>();
  const { isOpen, openModal, closeModal } = useModal();
  const [currentMusic, setCurrentMusic] = useState<number>(0);

  const deleteMusicMutation = useDeleteMusicById();

  const {
    data: musicList,
    isError,
    isLoading,
    refetch: refresh,
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

  let data: Music[] = [];
  if (musicList && musicList.length > 0) {
    data = musicList.map((music: Music) => {
      return {
        id: music.id,
        artist_id: music.artist_id,
        artist_name: music.artist_name,
        title: music.title,
        album_name: music.album_name,
        genre: music.genre,
        created_at: music.created_at,
      };
    });
  }

  const convertArrayOfObjectsToCSV = (musics: Music[]) => {
    let result: string;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(musics[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    musics.forEach((music) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += music[key as keyof Music];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  };

  const downloadCSV = (musics: Music[]) => {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(musics);
    if (csv == null) return;

    const filename = "musiclist.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  };

  const Export = ({ onExport }: { onExport: () => void }) => (
    <FButton className="export" disabled={false} onClick={() => onExport()}>
      <CiExport /> Export
    </FButton>
  );

  const ActionsMemo = <Export onExport={() => downloadCSV(data)} />;

  const columns: TableColumn<Music>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Artist ID",
      selector: (row) => row.artist_id || 0,
      sortable: true,
    },
    {
      name: "Artist Name",
      selector: (row) => row.artist_name,
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Album Name",
      selector: (row) => row.album_name,
      sortable: true,
    },
    {
      name: "Genre",
      selector: (row) => row.genre,
      sortable: true,
    },
    {
      name: "Created at",
      selector: (row) => row.created_at || "",
      sortable: true,
    },
    {
      name: "Actions",
      sortable: true,
      cell: (row) => (
        <div className="action-icons">
          <Link to={`/music/edit/${row.id}`}>
            <FaRegEdit className="action-icons__edit" />
          </Link>

          <FaRegTrashAlt
            className="action-icons__delete"
            onClick={() => {
              openModal();
              setCurrentMusic(parseInt(row.id));
            }}
          />
        </div>
      ),
    },
  ];

  const paginationComponentOptions = {
    noRowsPerPage: true,
  };

  return (
    <MusicListLayout title="Music Summary: Music List" refresh={refresh}>
      <DataTable
        pagination
        paginationComponentOptions={paginationComponentOptions}
        highlightOnHover
        columns={columns}
        data={data}
        actions={
          <div className="table-actions">
            {auth.role === "artist" && (
              <>
                <NavLink
                  className="create-new"
                  to={`/music/create/${artist_id}`}
                >
                  <IoPersonAddOutline /> Create New Music
                </NavLink>
                {ActionsMemo}
              </>
            )}
          </div>
        }
      />
      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="modal-info">
          <p>Are you sure you want to delete this artist?</p>
          <div className="modal-info__actions">
            <button className="modal-info__confirm" onClick={handleDelete}>
              Confirm
            </button>
            <button className="modal-info__cancel" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </MusicListLayout>
  );
};

export default MusicList;
