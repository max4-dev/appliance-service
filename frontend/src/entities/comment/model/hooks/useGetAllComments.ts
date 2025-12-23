import { useQuery } from "@tanstack/react-query";
import { client } from "@/shared/api/client";

export const useGetAllComments = () => {
  return useQuery({
    queryKey: ["all-comments"],
    queryFn: async () => {
      const response = await client.get("/comments/all");
      return response.data;
    },
  });
};
