import { useMutation } from "@tanstack/react-query";

import { User } from "../types/users.type";
import UserForm from "../components/UserForm";
import { createUser } from "../api/api.service";
import { initialUserData } from "../data/user.data";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const CreateUser = () => {
  const history = useHistory();

  const createUserMutation = useMutation({
    mutationFn: (user: User) => createUser(user),
    onSuccess: () => {
      history.push("/home");
      return toast.success("User created successfully");
    },
  });

  const handleUser = (user: User) => {
    createUserMutation.mutate(user);
  };

  return (
    <UserForm
      title="Create User"
      initialUserData={initialUserData}
      handleUser={handleUser}
    />
  );
};

export default CreateUser;
