import { client } from "@/shared/api";
import { useQuery } from "@tanstack/react-query";

export const useGetStatistics = () => {
  return useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const response = await client.get("/requests/statistics");
      return response.data;
    },
  });
};
