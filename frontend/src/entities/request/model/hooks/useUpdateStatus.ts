import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { requestQuery } from "../../api/query";
import { UpdateRequestStatusDto } from "../types/request";

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-request-status'],
    mutationFn: ({ id, data }: { id: number; data: UpdateRequestStatusDto }) => 
      requestQuery.updateStatus(id, data),
    onSuccess: (data) => {
      message.success("Статус обновлен");
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
    onError: (error) => {
      console.error(error);
      message.error("Не удалось обновить статус");
    },
  });
};
