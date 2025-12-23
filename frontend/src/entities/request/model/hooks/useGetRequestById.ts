import { useQuery } from "@tanstack/react-query";
import { requestQuery } from "../../api/query";

export const useGetRequestById = (id: number) => {
  return useQuery({
    queryKey: ["request", id],
    queryFn: () => requestQuery.getById(id),
    enabled: !!id,
  });
};
