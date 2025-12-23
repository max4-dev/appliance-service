import { requestQuery } from "@/entities/request/api/query";
import { useGetRequestById } from "@/entities/request/model/hooks/useGetRequestById";
import { RequestStatusLabels } from "@/entities/request/model/types/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Select, Space, Spin } from "antd";
import { FC, useEffect } from "react";

interface Props {
  requestId: number;
  userId: string;
  onSuccess?: () => void;
}

export const UpdateRequestStatusForm: FC<Props> = ({
  requestId,
  userId,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { data: request, isLoading } = useGetRequestById(requestId);
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: (data: UpdateRequestStatusDto) =>
      requestQuery.updateStatus(requestId, data),
    onSuccess: () => {
      message.success("Статус успешно обновлен");
      queryClient.invalidateQueries({ queryKey: ["request", requestId] });
      onSuccess?.();
    },
    onError: () => {
      message.error("Ошибка при обновлении статуса");
    },
  });

  useEffect(() => {
    if (request) {
      form.setFieldsValue({
        newStatus: request.requestStatus,
      });
    }
  }, [request, form]);

  const onFinish = (values: any) => {
    const payload: UpdateRequestStatusDto = {
      newStatus: values.newStatus,
      reason: values.reason,
      changedById: userId,
    };
    updateStatusMutation.mutate(payload);
  };

  if (isLoading) {
    return <Spin />;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Новый статус"
        name="newStatus"
        rules={[{ required: true, message: "Обязательное поле" }]}
      >
        <Select placeholder="Выберите новый статус">
          {Object.entries(RequestStatusLabels).map(([key, value]) => (
            <Select.Option key={key} value={key}>
              {value}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Причина изменения"
        name="reason"
        rules={[{ required: false }]}
      >
        <Input.TextArea
          placeholder="Опишите причину изменения статуса"
          rows={3}
        />
      </Form.Item>

      <Space>
        <Button
          type="primary"
          htmlType="submit"
          loading={updateStatusMutation.isPending}
        >
          Обновить статус
        </Button>
      </Space>
    </Form>
  );
};
