import { client } from "@/shared/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-user"],
    mutationFn: (userId: string) => client.delete(`/users/${userId}`),
    onSuccess: () => {
      message.success("Пользователь успешно удален");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      message.error("Ошибка при удалении пользователя");
    },
  });
};
