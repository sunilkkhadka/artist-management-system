import { useParams } from "react-router-dom";

import { User } from "../types/users.type";
import UserForm from "../components/UserForm";
import { useMutation } from "@tanstack/react-query";
import { updateUserById } from "../api/api.service";
import { useGetUserById } from "../hooks/useFetchUsers";
import { getInitialUserData } from "../data/user.data";

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isError, isLoading } = useGetUserById(parseInt(id));

  const updateUserMutation = useMutation({
    mutationFn: (user: User) => updateUserById(user),
  });

  if (isLoading) {
    return <h1>Loading User Data...</h1>;
  }

  if (isError) {
    return <h1>Something went wrong...</h1>;
  }

  const initialUserData = getInitialUserData(data);

  const handleUser = (user: User) => {
    updateUserMutation.mutate(user);
  };

  return (
    <UserForm
      title="Edit User"
      initialUserData={initialUserData}
      handleUser={handleUser}
    />
  );
};

export default EditUser;
