import { useQuery } from "@tanstack/react-query";
import { client } from "@/shared/api";

export const useGetComments = (requestId: number) => {
  return useQuery({
    queryKey: ["comments", requestId],
    queryFn: async () => {
      const response = await client.get(`/requests/${requestId}/comments`);
      return response.data;
    },
    enabled: !!requestId,
  });
};
