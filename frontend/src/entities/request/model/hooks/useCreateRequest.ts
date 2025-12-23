import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { requestQuery } from "../../api/query";
import { CreateRequestDto } from "../types/request";

export const useCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['create-request'],
    mutationFn: (data: CreateRequestDto) => requestQuery.create(data),
    onSuccess: () => {
      message.success("Заявка успешно создана");
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
    onError: (error: any) => {
      console.error(error);
      const errorMsg = error.response?.data?.message; 
      const text = Array.isArray(errorMsg) ? errorMsg.join(', ') : "Не удалось создать заявку";
      message.error(text);
    },
  });
};
