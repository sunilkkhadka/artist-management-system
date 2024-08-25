import { useMutation } from "@tanstack/react-query";

import { User } from "../users.type";
import UserForm from "../components/UserForm";
import { initialUserData } from "../user.data";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { createUser } from "../api/user.service";

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
