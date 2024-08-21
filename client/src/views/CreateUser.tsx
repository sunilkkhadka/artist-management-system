import { useMutation } from "@tanstack/react-query";

import { User } from "../types/users.type";
import UserForm from "../components/UserForm";
import { createUser } from "../api/api.service";
import { initialUserData } from "../data/user.data";

const CreateUser = () => {
  const createUserMutation = useMutation({
    mutationFn: (user: User) => createUser(user),
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
