import { User } from "./users.type";

export const initialUserData: User = {
  id: "",
  email: "",
  firstname: "",
  lastname: "",
  password: "",
  role: "",
  phone: "",
  dob: "",
  gender: "",
  address: "",
  created_at: "",
};

export const getInitialUserData = (user: User | undefined): User => {
  return {
    id: user?.id || "",
    email: user?.email || "",
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    password: "",
    role: user?.role || "",
    phone: user?.phone || "",
    dob: user?.dob || "",
    gender: user?.gender || "",
    address: user?.address || "",
    created_at: user?.created_at || "",
  };
};
