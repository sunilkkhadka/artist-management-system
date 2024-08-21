import { useState } from "react";
import { useGetUsers } from "../hooks/useFetchUsers";
import { Link, NavLink } from "react-router-dom";
import useModal from "../hooks/useModal";
import Modal from "../components/Modal";
import { useMutation } from "@tanstack/react-query";
import { deleteArtistById, deleteUserById } from "../api/api.service";
import { useGetArtists } from "../hooks/useArtists";
import { useAuth } from "../hooks/useAuth";

type TabListProps = {
  name: string;
  show: boolean;
  component: React.ReactElement;
};

const Home = () => {
  const auth = useAuth();

  const tabList: TabListProps[] = [
    {
      name: "User List",
      show: auth.role === "super_admin" ? true : false,
      component: <UserList />,
    },
    {
      name: "Artist List",
      show: auth.role === "artist_manager" ? false : true,
      component: <ArtistList />,
    },
  ];

  return <Tabs tabList={tabList} />;
};

const Tabs = ({ tabList }: { tabList: TabListProps[] }) => {
  const [activeTab, setActiveTab] = useState<TabListProps>(tabList[0]);

  const handleActiveTab = (tab: TabListProps) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div>
        <ul>
          {tabList.map((tab) => (
            <li key={tab.name} onClick={() => handleActiveTab(tab)}>
              {tab.name}
            </li>
          ))}
        </ul>
      </div>
      {activeTab?.component ? activeTab.component : ""}
    </>
  );
};

const ArtistList = () => {
  const { data: artistList, isLoading, isError } = useGetArtists();
  const { isOpen, openModal, closeModal } = useModal();
  const [currentArtist, setCurrentArtist] = useState<number>(0);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteArtistById(id),
  });

  if (isLoading) {
    return <h1>Loading artist list...</h1>;
  }

  if (isError) {
    return <h1>Something went wrong...</h1>;
  }

  const handleDelete = () => {
    deleteMutation.mutate(currentArtist);
    console.log("artist deleted");
    closeModal();
  };

  return (
    <section>
      <h1>Artists</h1>
      <NavLink className="create-new" to="/artist/create">
        Create New Artist
      </NavLink>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Date of birth</th>
            <th>Gender</th>
            <th>Address</th>
            <th>First Year Release</th>
            <th>No. of Albums Released</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Deleted at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {artistList?.map((artist) => (
            <tr key={artist.id}>
              <td>{artist.id}</td>
              <td>
                <Link to={`/artist/music/${artist.id}`}>{artist.name}</Link>
              </td>
              <td>{artist.dob}</td>
              <td>{artist.gender}</td>
              <td>{artist.address}</td>
              <td>{artist.first_year_release}</td>
              <td>{artist.no_of_albums_released}</td>
              <td>{artist.created_at}</td>
              <td>{artist.updated_at?.Time}</td>
              <td>{artist.deleted_at?.Time}</td>
              <td>
                <Link to={`/artist/edit/${artist.id}`}>Edit</Link>
                <p
                  onClick={() => {
                    openModal();
                    setCurrentArtist(parseInt(artist.id));
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
        <h2>Are you sure you want to delete this artist?</h2>
        <button onClick={handleDelete}>Confirm</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </section>
  );
};

const UserList = () => {
  const { data: userList } = useGetUsers();
  const { isOpen, openModal, closeModal } = useModal();
  const [currentUser, setCurrentUser] = useState<number>(0);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUserById(id),
  });

  const handleDelete = () => {
    deleteMutation.mutate(currentUser);
    closeModal();
  };

  return (
    <section>
      <h1>Users</h1>
      <NavLink className="create-new" to="/user/create">
        Create New User
      </NavLink>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Role</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Date of birth</th>
            <th>Address</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Deleted at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList?.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.role}</td>
              <td>{user.gender}</td>
              <td>{user.phone}</td>
              <td>{user.dob}</td>
              <td>{user.address}</td>
              <td>{user.created_at}</td>
              <td>{user.updated_at?.Time}</td>
              <td>
                <Link to={`/user/edit/${user.id}`}>Edit</Link>
                <p
                  onClick={() => {
                    openModal();
                    setCurrentUser(parseInt(user.id));
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
        <h2>Are you sure you want to delete this user?</h2>
        <button onClick={handleDelete}>Confirm</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </section>
  );
};

export default Home;
