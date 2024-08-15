import { useState } from "react";
import { useGetUsers } from "../hooks/useFetchUsers";
import { Link } from "react-router-dom";
import useModal from "../hooks/useModal";
import Modal from "../components/Modal";
import { useMutation } from "@tanstack/react-query";
import { deleteUserById } from "../api/api.service";

type TabListProps = {
  name: string;
  show: boolean;
  component: React.ReactElement;
};

const Home = () => {
  const tabList: TabListProps[] = [
    {
      name: "User List",
      show: true,
      component: <UserList />,
    },
    {
      name: "Artist List",
      show: true,
      component: <h1>Artist List Component</h1>,
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

const UserList = () => {
  const { data: userList } = useGetUsers();
  const { isOpen, openModal, closeModal } = useModal();
  const [currentUser, setCurrentUser] = useState<number>(0);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUserById(id),
  });

  const handleDelete = () => {
    deleteMutation.mutate(currentUser);
    console.log("User deleted");
    closeModal();
  };

  return (
    <section>
      <h1>Users</h1>
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
