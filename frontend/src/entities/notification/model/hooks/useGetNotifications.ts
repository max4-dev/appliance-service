import { useQuery } from "@tanstack/react-query";
import { client } from "@/shared/api";

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await client.get("/notifications");
      return response.data;
    },
  });
};
