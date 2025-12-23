import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { requestQuery } from "../../api/query";

export const useAssignMaster = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['assign-master'],
    mutationFn: ({ requestId, masterId }: { requestId: number; masterId: string }) => 
      requestQuery.assignMaster(requestId, masterId),
    onSuccess: () => {
      message.success("Мастер назначен");
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
    onError: (error) => {
      console.error(error);
      message.error("Не удалось назначить мастера");
    },
  });
};
