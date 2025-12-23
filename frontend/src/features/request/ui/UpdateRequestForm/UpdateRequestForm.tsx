import { requestQuery } from "@/entities/request/api/query";
import { useGetRequestById } from "@/entities/request/model/hooks/useGetRequestById";
import { ClimateTechTypeLabels, UpdateRequestDto } from "@/entities/request/model/types/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Select, Space, Spin } from "antd";
import { FC, useEffect } from "react";


interface Props {
  requestId: number;
  onSuccess?: () => void;
}

export const UpdateRequestForm: FC<Props> = ({ requestId, onSuccess }) => {
  const [form] = Form.useForm();
  const { data: request, isLoading } = useGetRequestById(requestId);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: UpdateRequestDto) =>
      requestQuery.update(requestId, data),
    onSuccess: () => {
      message.success("Заявка успешно обновлена");
      queryClient.invalidateQueries({ queryKey: ["request", requestId] });
      onSuccess?.();
    },
    onError: () => {
      message.error("Ошибка при обновлении заявки");
    },
  });

  useEffect(() => {
    if (request) {
      form.setFieldsValue({
        climateTechType: request.climateTechType,
        climateTechModel: request.climateTechModel,
        problemDescription: request.problemDescription,
        repairParts: request.repairParts,
      });
    }
  }, [request, form]);

  const onFinish = (values: any) => {
    updateMutation.mutate(values);
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
        label="Тип оборудования"
        name="climateTechType"
        rules={[{ required: false }]}
      >
        <Select placeholder="Выберите тип оборудования">
          {Object.entries(ClimateTechTypeLabels).map(([key, value]) => (
            <Select.Option key={key} value={key}>
              {value}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Модель устройства"
        name="climateTechModel"
        rules={[{ required: false }]}
      >
        <Input placeholder="Введите модель устройства" />
      </Form.Item>

      <Form.Item
        label="Описание проблемы"
        name="problemDescription"
        rules={[{ required: false }]}
      >
        <Input.TextArea
          placeholder="Опишите проблему"
          rows={4}
        />
      </Form.Item>

      <Form.Item
        label="Замененные запчасти"
        name="repairParts"
        rules={[{ required: false }]}
      >
        <Input.TextArea
          placeholder="Перечислите замененные запчасти"
          rows={3}
        />
      </Form.Item>

      <Space>
        <Button
          type="primary"
          htmlType="submit"
          loading={updateMutation.isPending}
        >
          Обновить
        </Button>
      </Space>
    </Form>
  );
};
