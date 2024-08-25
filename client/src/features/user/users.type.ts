export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  password?: string;
  role: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  created_at?: string;
  updated_at?: {
    Time: string;
  };
  deleted_at?: {
    Time: string;
  };
}

export interface UserListProps {
  collection: User[];
}

export interface UserFormProps {
  title: string;
  initialUserData: User;
  handleUser: (user: User) => void;
}
