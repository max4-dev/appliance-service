import { Button, Card, Form, Input, Typography } from "antd";
import cn from "classnames";
import { Link, useNavigate } from "react-router";
import { login } from "../../model/login";
import { LoginField } from "../../model/types/login";
import styles from "./LoginForm.module.css";
import { LoginFormProps } from "./LoginForm.props";

export const LoginForm = ({ className }: LoginFormProps) => {
  const navigate = useNavigate();
  
  const onFinish = async (data: LoginField) => {
    const { isSuccess } = await login(data);

    if (isSuccess) {
      navigate('/');
    }
  };

  return <Card className={cn(styles.login, className)} title="Вход" variant="borderless">
      <Form
      className={styles.form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item<LoginField>
        label="Логин"
        name="login"
        rules={[{ required: true, message: 'Введите логин' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<LoginField>
        label="Пароль"
        name="password"
        rules={[{ required: true, message: 'Введите пароль' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label={null}>
        <Button size="large" type="primary" htmlType="submit">
          Вход
        </Button>
      </Form.Item>
    </Form>

    <div className={styles.footer}>
      <Typography.Text type="secondary">Нет аккаунта? </Typography.Text>
      <Link to="/register">Регистрация</Link>
    </div>
  </Card>
};