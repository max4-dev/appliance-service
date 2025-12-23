import { useQuery } from "@tanstack/react-query";
import { client } from "@/shared/api/client";

export const useGetAllOrderedParts = () => {
  return useQuery({
    queryKey: ["all-ordered-parts"],
    queryFn: async () => {
      const response = await client.get("/ordered-parts/all");
      return response.data;
    },
  });
};
