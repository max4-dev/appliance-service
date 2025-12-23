import { useQuery } from "@tanstack/react-query";
import { client } from "@/shared/api";
import { User } from "../types/user";

export const useGetUserById = (userId: string) => {
  return useQuery<User>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await client.get(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};
