import { useQuery } from "@tanstack/react-query";

import { fetchUserById, fetchUsers } from "../api/api.service";

export const useGetUsers = (page: number, perPage: number) => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(page, perPage),
  });

  return { data: data?.data.collection, isLoading, refetch };
};

export const useGetUserById = (id: number) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["userById", id],
    queryFn: () => fetchUserById(id),
  });

  return { data: data?.data, isError, isLoading };
};
