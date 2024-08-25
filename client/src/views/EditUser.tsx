import axios from "axios";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router-dom";

import { User } from "../types/users.type";
import UserForm from "../components/UserForm";
import { useMutation } from "@tanstack/react-query";
import { updateUserById } from "../api/api.service";
import { getInitialUserData } from "../data/user.data";
import { useGetUserById } from "../hooks/useFetchUsers";

const EditUser = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { data, isError, isLoading } = useGetUserById(parseInt(id));

  const updateUserMutation = useMutation({
    mutationFn: (user: User) => updateUserById(user),
    onSuccess: () => {
      history.push("/home");
      return toast.success("User edited successfully");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 502) {
          return toast.error("Couldn't update the user");
        }
      }
    },
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
