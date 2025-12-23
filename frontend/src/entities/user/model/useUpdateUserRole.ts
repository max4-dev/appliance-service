import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { client } from "@/shared/api";
import { UpdateUserRoleDto } from "../types/user";

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-user-role"],
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRoleDto }) =>
      client.put(`/users/${userId}/role`, data),
    onSuccess: () => {
      message.success("Роль пользователя обновлена");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      message.error("Ошибка при обновлении роли");
    },
  });
};
