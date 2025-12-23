import { useAssignMaster } from "@/entities/request/model/hooks/useAssignMaster";
import { useGetRequestById } from "@/entities/request/model/hooks/useGetRequestById";
import { client } from "@/shared/api";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Select, Space, Spin, message } from "antd";
import { FC, useEffect, useState } from "react";

interface Props {
  requestId: number;
  onSuccess?: () => void;
}

export const AssignMasterForm: FC<Props> = ({ requestId, onSuccess }) => {
  const [form] = Form.useForm();
  const { data: request, isLoading } = useGetRequestById(requestId);
  const assignMasterMutation = useAssignMaster();
  const queryClient = useQueryClient();
  const [specialists, setSpecialists] = useState([]);
  const [loadingSpecialists, setLoadingSpecialists] = useState(false);

  useEffect(() => {
    const fetchSpecialists = async () => {
      setLoadingSpecialists(true);
      try {
        const response = await client.get("/users/specialists");
        setSpecialists(response.data);
      } catch (error) {
        console.error(error);
        message.error("Ошибка при загрузке списка специалистов");
      } finally {
        setLoadingSpecialists(false);
      }
    };
    fetchSpecialists();
  }, []);

  useEffect(() => {
    if (request && request.master) {
      form.setFieldsValue({
        masterId: request.master.id,
      });
    }
  }, [request, form]);

  const onFinish = (values: any) => {
    assignMasterMutation.mutate(
      { requestId, masterId: values.masterId },
      {
        onSuccess: () => {
          message.success("Мастер успешно назначен");
          queryClient.invalidateQueries({ queryKey: ["request", requestId] });
          onSuccess?.();
        },
      }
    );
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
        label="Выберите специалиста"
        name="masterId"
        rules={[{ required: true, message: "Обязательное поле" }]}
      >
        <Select
          placeholder="Выберите мастера"
          loading={loadingSpecialists}
          options={specialists.map((specialist: any) => ({
            label: `${specialist.name} (${specialist.phone})`,
            value: specialist.id,
          }))}
        />
      </Form.Item>

      <Space>
        <Button
          type="primary"
          htmlType="submit"
          loading={assignMasterMutation.isPending}
        >
          Назначить
        </Button>
      </Space>
    </Form>
  );
};
