import { useQuery } from "@tanstack/react-query";
import { client } from "@/shared/api";
import { User } from "../types/user";

export const useGetUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await client.get("/users");
      return response.data;
    },
  });
};
