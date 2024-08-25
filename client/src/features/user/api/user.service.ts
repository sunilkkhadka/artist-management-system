import routes from "../../../routes/routes.data";
import { client } from "../../../shared/api/http.api";
import { UserListProps, User } from "../users.type";

export const fetchUsers = async (page = 1, perPage = 5) => {
  const response = await client.get<UserListProps>(
    `${routes.USERS}?page=${page}&per_page=${perPage}`
  );

  return response;
};

export const createUser = async (user: User) => {
  const response = await client.post(routes.USER, JSON.stringify(user));
  return response;
};

export const fetchUserById = async (id: number) => {
  const response = await client.get<User>(`${routes.USER}/${id}`);

  return response;
};

export const updateUserById = async (user: User) => {
  const response = await client.patch(
    `${routes.USER}/${user.id}`,
    JSON.stringify(user)
  );
  return response;
};

export const deleteUserById = async (id: number) => {
  const response = await client.patch(`${routes.DELETE_USER}/${id}`);
  return response;
};
