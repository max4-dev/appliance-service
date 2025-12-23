import { Button, Card, Form, Input, Typography } from "antd";
import cn from "classnames";
import { Link, useNavigate } from "react-router";
import { register } from "../../model/register";
import { RegisterField } from "../../model/types/register";
import styles from "./RegisterForm.module.css";
import { RegisterFormProps } from "./RegisterForm.props";

export const RegisterForm = ({ className }: RegisterFormProps) => {
  const navigate = useNavigate();

  const onFinish = async (data: RegisterField) => {
    const { isSuccess } = await register(data);

    if (isSuccess) {
      navigate('/');
    }
  };

  return <Card className={cn(styles.register, className)} title="Регистрация" variant="borderless">
      <Form
      className={styles.form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item<RegisterField>
        label="Имя"
        name="name"
        rules={[
          { required: true, message: 'Введите имя' },
          { min: 3, message: 'Минимум 3 символа' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<RegisterField>
        label="Логин"
        name="login"
        rules={[
          { required: true, message: 'Введите логин' },
          { min: 3, message: 'Минимум 3 символа' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<RegisterField>
        label="Телефон"
        name="phone"
        rules={[{ required: true, message: 'Введите телефон' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<RegisterField>
        label="Пароль"
        name="password"
        rules={[
          { required: true, message: 'Введите пароль' },
          { min: 8, message: 'Пароль должен быть не менее 8 символов' }
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label={null}>
        <Button size="large" type="primary" htmlType="submit">
          Зарегистрироваться
        </Button>
      </Form.Item>
    </Form>

    <div className={styles.footer}>
      <Typography.Text type="secondary">Есть аккаунт? </Typography.Text>
      <Link to="/login">Вход</Link>
    </div>
  </Card>
};
