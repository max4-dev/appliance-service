import { client } from "@/shared/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { CreateUserDto } from "../types/user";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-user"],
    mutationFn: (data: CreateUserDto) => client.post("/users", data),
    onSuccess: () => {
      message.success("Пользователь успешно создан");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: unknown) => {
      console.error(error);
      message.error("Ошибка при создании пользователя");
    },
  });
};
