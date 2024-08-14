import { useQuery } from "@tanstack/react-query";

import { fetchUsers } from "../api/api.service";

export const useGetUsers = () => {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  return { data };
};
