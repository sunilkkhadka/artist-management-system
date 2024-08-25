import { useState } from "react";
import { Modal } from "reactstrap";
import { CiExport } from "react-icons/ci";
import { Link, NavLink } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { IoPersonAddOutline } from "react-icons/io5";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import DataTable, { TableColumn } from "react-data-table-component";

import useModal from "../hooks/useModal";
import { useGetUsers } from "../hooks/useFetchUsers";

import { FButton } from "../utils/inputs";
import { getDateInYMDFormat } from "../utils/date";

import { User } from "../types/users.type";
import { deleteUserById } from "../api/api.service";
import ListLayout from "../layouts/ListLayout";
import { toast } from "react-toastify";

const UserList = () => {
  const [page, setPage] = useState(1);
  const { data: userList, isLoading, refetch: refresh } = useGetUsers(page, 4);
  const { isOpen, openModal, closeModal } = useModal();
  const [currentUser, setCurrentUser] = useState<number>(0);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUserById(id),
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const handleDelete = () => {
    deleteMutation.mutate(currentUser);
    closeModal();
    refresh();
    return toast.success("User deleted successfully");
  };

  let data: User[] = [];
  if (userList && userList.length > 0) {
    data = userList?.map((user) => {
      return {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        gender: user.gender,
        phone: user.phone,
        dob: getDateInYMDFormat(user.dob),
        address: user.address,
        created_at: getDateInYMDFormat(user.created_at),
      };
    });
  }

  const columns: TableColumn<User>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "First Name",
      selector: (row) => row.firstname,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.lastname,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Date of Birth",
      selector: (row) => row.dob,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.address,
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
          <Link to={`/user/edit/${row.id}`}>
            <FaRegEdit className="action-icons__edit" />
          </Link>

          <FaRegTrashAlt
            className="action-icons__delete"
            onClick={() => {
              openModal();
              setCurrentUser(parseInt(row.id));
            }}
          />
        </div>
      ),
    },
  ];

  const paginationComponentOptions = {
    noRowsPerPage: true,
  };

  function convertArrayOfObjectsToCSV(users: User[]) {
    let result: string;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(users[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    users?.forEach((user) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += user[key as keyof User];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  function downloadCSV(users: User[]) {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(users);
    if (csv == null) return;

    const filename = "userlist.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  }

  const Export = ({ onExport }: { onExport: () => void }) => (
    <FButton className="export" disabled={false} onClick={() => onExport()}>
      <CiExport /> Export
    </FButton>
  );

  const ActionsMemo = <Export onExport={() => downloadCSV(data)} />;

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <ListLayout title="List Summary: User List" refresh={refresh}>
      <DataTable
        pagination
        paginationComponentOptions={paginationComponentOptions}
        paginationServer
        paginationTotalRows={userList?.length}
        paginationPerPage={4}
        paginationDefaultPage={0}
        onChangePage={handlePageChange}
        highlightOnHover
        columns={columns}
        data={data}
        actions={
          <div className="table-actions">
            <NavLink className="create-new" to="/user/create">
              <IoPersonAddOutline /> Create New User
            </NavLink>
            {ActionsMemo}
          </div>
        }
      />
      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="modal-info">
          <p>Are you sure you want to delete this user?</p>
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

export default UserList;
