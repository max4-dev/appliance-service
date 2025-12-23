import { useQuery } from "@tanstack/react-query";
import { client } from "@/shared/api";

export const useOrderedParts = (requestId: number) => {
  return useQuery({
    queryKey: ["ordered-parts", requestId],
    queryFn: async () => {
      const response = await client.get(`/requests/${requestId}/ordered-parts`);
      return response.data;
    },
    enabled: !!requestId,
  });
};
