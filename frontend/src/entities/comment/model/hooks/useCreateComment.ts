import { client } from "@/shared/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

interface CreateCommentParams {
  requestId: number;
  message: string;
}

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-comment"],
    mutationFn: ({ requestId, message }: CreateCommentParams) =>
      client.post(`/requests/${requestId}/comments`, { message }),
    onSuccess: (data, variables) => {
      message.success("Комментарий добавлен");
      queryClient.invalidateQueries({ queryKey: ["request", variables.requestId] });
    },
    onError: (error) => {
      console.error(error);
      message.error("Не удалось добавить комментарий");
    },
  });
};
