import { useGetUserById } from "@/entities/user/model/useGetUserById";
import { useUpdateUserRole } from "@/entities/user/model/useUpdateUserRole";
import { UserRole, UserRoleLabels } from "@/entities/user/types/user";
import { Button, Form, Select, Space, Spin } from "antd";
import { FC, useEffect } from "react";

interface Props {
  userId: string;
  onSuccess?: () => void;
}

export const UpdateUserRoleForm: FC<Props> = ({ userId, onSuccess }) => {
  const [form] = Form.useForm();
  const { data: user, isLoading } = useGetUserById(userId);
  const updateUserRoleMutation = useUpdateUserRole();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        role: user.role,
      });
    }
  }, [user, form]);

  const onFinish = (values: { role: UserRole }) => {
    updateUserRoleMutation.mutate(
      { userId, data: { role: values.role } },
      {
        onSuccess: () => {
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
        label="Новая роль"
        name="role"
        rules={[{ required: true, message: "Обязательное поле" }]}
      >
        <Select placeholder="Выберите новую роль">
          {Object.entries(UserRoleLabels).map(([key, value]) => (
            <Select.Option key={key} value={key}>
              {value}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Space>
        <Button
          type="primary"
          htmlType="submit"
          loading={updateUserRoleMutation.isPending}
        >
          Обновить роль
        </Button>
      </Space>
    </Form>
  );
};
