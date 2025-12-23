import { useQuery } from "@tanstack/react-query";
import { userQuery } from "../api/query";

export const useClients = () => {
  return useQuery({
    queryKey: ['users', 'list'],
    queryFn: userQuery.getClients,
    select: (data) => {
      return data?.map((user) => ({
        label: `${user.name} (${user.phone || user.login})`,
        value: user.id,
      }));
    },
  });
};
