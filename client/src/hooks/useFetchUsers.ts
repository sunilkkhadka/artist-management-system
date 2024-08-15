import { useQuery } from "@tanstack/react-query";

import { fetchUserById, fetchUsers } from "../api/api.service";

export const useGetUsers = () => {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  return { data: data?.data.collection };
};

export const useGetUserById = (id: number) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["userById", id],
    queryFn: () => fetchUserById(id),
  });

  return { data: data?.data, isError, isLoading };
};
