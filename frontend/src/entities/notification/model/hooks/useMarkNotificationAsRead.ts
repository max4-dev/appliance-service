import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { client } from "@/shared/api";

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["mark-notification-read"],
    mutationFn: (notificationId: string) =>
      client.put(`/notifications/${notificationId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error(error);
      message.error("Ошибка при отметке уведомления");
    },
  });
};
