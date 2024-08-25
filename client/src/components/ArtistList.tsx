import { useState } from "react";
import { Modal } from "reactstrap";
import { CiExport } from "react-icons/ci";
import { NavLink, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { IoPersonAddOutline } from "react-icons/io5";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import DataTable, { TableColumn } from "react-data-table-component";

import useModal from "../hooks/useModal";
import { useGetArtists } from "../hooks/useArtists";
import { deleteArtistById } from "../api/api.service";

import { FButton } from "../utils/inputs";
import { getDateInYMDFormat } from "../utils/date";

import { Artist } from "../types/artist.type";
import ListLayout from "../layouts/ListLayout";
import { useAuth } from "../hooks/useAuth";

const ArtistList = () => {
  const auth = useAuth();
  const { isOpen, openModal, closeModal } = useModal();
  const [currentArtist, setCurrentArtist] = useState<number>(0);
  const {
    data: artistList,
    isLoading,
    isError,
    refetch: refresh,
  } = useGetArtists();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteArtistById(id),
  });

  if (isLoading) {
    return <h1>Loading artist list...</h1>;
  }

  if (isError) {
    return <h1>Something went wrong...</h1>;
  }

  let data: Artist[] = [];
  if (artistList && artistList.length > 0) {
    data = artistList.map((artist) => {
      return {
        id: artist.id,
        first_year_release: artist.first_year_release,
        no_of_albums_released: artist.no_of_albums_released,
        name: artist.name,
        dob: getDateInYMDFormat(artist.dob),
        gender: artist.gender,
        address: artist.address,
        created_at: getDateInYMDFormat(artist.created_at),
      };
    });
  }

  const convertArrayOfObjectsToCSV = (artists: Artist[]) => {
    let result: string;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(artists[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    artists.forEach((artist) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += artist[key as keyof Artist];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  };

  const downloadCSV = (artists: Artist[]) => {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(artists);
    if (csv == null) return;

    const filename = "artistlist.csv";

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

  const handleDelete = () => {
    deleteMutation.mutate(currentArtist);
    console.log("artist deleted");
    closeModal();
  };

  const columns: TableColumn<Artist>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => {
        if (auth.role === "artist_manager" || auth.role === "super_admin") {
          return <Link to={`/artist/music/${row.id}`}>{row.name}</Link>;
        } else {
          return row.name;
        }
      },
    },
    {
      name: "Date of Birth",
      selector: (row) => row.dob,
      sortable: true,
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      sortable: true,
    },

    {
      name: "Address",
      selector: (row) => row.address,
      sortable: true,
    },
    {
      name: "First year release",
      selector: (row) => row.first_year_release,
      sortable: true,
    },
    {
      name: "No of albums released",
      selector: (row) => row.no_of_albums_released,
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
      cell: (row) =>
        auth.role === "artist_manager" && (
          <>
            <div className="action-icons">
              <Link to={`/artist/edit/${row.id}`}>
                <FaRegEdit className="action-icons__edit" />
              </Link>
              <FaRegTrashAlt
                className="action-icons__delete"
                onClick={() => {
                  openModal();
                  setCurrentArtist(parseInt(row.id));
                }}
              />
            </div>
          </>
        ),
    },
  ];

  const paginationComponentOptions = {
    noRowsPerPage: true,
  };

  return (
    <ListLayout title="List Summary: Artist List" refresh={refresh}>
      <DataTable
        pagination
        paginationComponentOptions={paginationComponentOptions}
        highlightOnHover
        columns={columns}
        data={data}
        actions={
          <div className="table-actions">
            {auth.role === "artist_manager" && (
              <>
                <NavLink className="create-new" to="/artist/create">
                  <IoPersonAddOutline /> Create New Artist
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
    </ListLayout>
  );
};

export default ArtistList;
