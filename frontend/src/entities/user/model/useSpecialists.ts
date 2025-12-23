import { useQuery } from "@tanstack/react-query";
import { userQuery } from "../api/query";

export const useSpecialists = () => {
  return useQuery({
    queryKey: ['users', 'specialists'],
    queryFn: userQuery.getSpecialists,
    select: (data) => {
      return data.map((user) => ({
        label: user.name,
        value: user.id,
      }));
    },
  });
};
