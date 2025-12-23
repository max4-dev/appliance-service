import { useCreateUser } from "@/entities/user/model/useCreateUser";
import { CreateUserDto, UserRoleLabels } from "@/entities/user/types/user";
import { Button, Form, Input, Select, Space } from "antd";
import { FC } from "react";

interface Props {
  onSuccess?: () => void;
}

export const CreateUserForm: FC<Props> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const createUserMutation = useCreateUser();

  const onFinish = (values: CreateUserDto) => {
    createUserMutation.mutate(values, {
      onSuccess: () => {
        form.resetFields();
        onSuccess?.();
      },
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Имя"
        name="name"
        rules={[{ required: true, message: "Обязательное поле" }]}
      >
        <Input placeholder="Введите имя пользователя" />
      </Form.Item>

      <Form.Item
        label="Логин"
        name="login"
        rules={[{ required: true, message: "Обязательное поле" }]}
      >
        <Input placeholder="Введите логин" />
      </Form.Item>

      <Form.Item
        label="Телефон"
        name="phone"
        rules={[{ required: true, message: "Обязательное поле" }]}
      >
        <Input placeholder="Введите номер телефона" />
      </Form.Item>

      <Form.Item
        label="Пароль"
        name="password"
        rules={[{ required: true, message: "Обязательное поле" }]}
      >
        <Input.Password placeholder="Введите пароль" />
      </Form.Item>

      <Form.Item
        label="Роль"
        name="role"
        rules={[{ required: true, message: "Обязательное поле" }]}
      >
        <Select placeholder="Выберите роль">
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
          loading={createUserMutation.isPending}
        >
          Создать пользователя
        </Button>
        <Button onClick={() => form.resetFields()}>Очистить</Button>
      </Space>
    </Form>
  );
};
