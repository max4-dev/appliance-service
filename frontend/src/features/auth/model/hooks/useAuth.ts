import { useEffect, useState } from "react";

import { mapUserDtoToView } from "@/entities/user/api/mapper";
import { userQuery } from "@/entities/user/api/query";
import { UserView } from "@/entities/user/types/user";

export const useAuth = () => {
  const [user, setUser] = useState<UserView | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await userQuery.getProfile();
        setUser(response ? mapUserDtoToView(response) : null);
      } catch (err) {
        console.log(err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  return { user, isLoading };
};
