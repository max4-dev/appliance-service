import { useQuery } from "@tanstack/react-query";
import { requestQuery } from "../../api/query";

export const useRequests = (search?: string) => {
  return useQuery({
    queryKey: ['requests', search],
    queryFn: () => search ? requestQuery.search(search) : requestQuery.getAll(),
  });
};
