import { client } from "./http.api";
import routes from "../data/routes.data";

export const fetchUsers = async () => {
  const response = await client.get(routes.USERS);
  console.log("response", response);

  return response;
};
