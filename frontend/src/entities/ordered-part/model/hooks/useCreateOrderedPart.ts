import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { client } from "@/shared/api";

export interface CreateOrderedPartDto {
  partName: string;
  partNumber?: string;
  quantity?: number;
  unitPrice?: number;
  supplier?: string;
  expectedDeliveryDate?: string;
}

export const useCreateOrderedPart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-ordered-part"],
    mutationFn: ({ requestId, data }: { requestId: number; data: CreateOrderedPartDto }) =>
      client.post(`/requests/${requestId}/ordered-parts`, data),
    onSuccess: (data, variables) => {
      message.success("Запчасть добавлена в заказ");
      queryClient.invalidateQueries({ queryKey: ["ordered-parts", variables.requestId] });
    },
    onError: (error) => {
      console.error(error);
      message.error("Не удалось добавить запчасть");
    },
  });
};
