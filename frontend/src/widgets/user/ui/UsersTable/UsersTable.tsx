import { useDeleteUser } from "@/entities/user/model/useDeleteUser";
import { User, UserRole, UserRoleLabels } from "@/entities/user/types/user";
import { DeleteOutlined, EditOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, Tag, Tooltip, Typography } from "antd";
import { FC } from "react";

interface UsersTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
}

export const UsersTable: FC<UsersTableProps> = ({ users, loading, onEdit }) => {
  const deleteUserMutation = useDeleteUser();

  const getRoleColor = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN: return "red";
      case UserRole.MANAGER: return "volcano";
      case UserRole.SPECIALIST: return "blue";
      case UserRole.CLIENT: return "green";
      default: return "default";
    }
  };

  const columns = [
    {
      title: "Имя",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <Space>
          <UserOutlined style={{ color: "#1890ff" }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: "Логин",
      dataIndex: "login",
      key: "login",
      render: (text: string) => <Typography.Text copyable>{text}</Typography.Text>,
    },
    {
      title: "Телефон",
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => (
        <Space>
          <PhoneOutlined style={{ color: "#8c8c8c" }} />
          {text}
        </Space>
      ),
    },
    {
      title: "Роль",
      dataIndex: "role",
      key: "role",
      render: (role: UserRole) => (
        <Tag color={getRoleColor(role)}>
          {UserRoleLabels[role]}
        </Tag>
      ),
      filters: Object.entries(UserRoleLabels).map(([value, text]) => ({
        text: text,
        value: value,
      })),
      onFilter: (value: boolean | React.Key, record: User) => record.role === value,
    },
    {
      title: "Дата регистрации",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString("ru-RU"),
      sorter: (a: User, b: User) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Действия",
      key: "actions",
      width: 120,
      render: (_: unknown, record: User) => (
        <Space size="middle">
          <Tooltip title="Изменить роль">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          
          <Tooltip title="Удалить пользователя">
            <Popconfirm
              title="Удалить пользователя?"
              description={`Вы уверены, что хотите удалить ${record.name}?`}
              onConfirm={() => deleteUserMutation.mutate(record.id)}
              okText="Да, удалить"
              cancelText="Отмена"
              okButtonProps={{ danger: true, loading: deleteUserMutation.isPending }}
            >
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
                loading={deleteUserMutation.isPending && deleteUserMutation.variables === record.id}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      loading={loading}
      rowKey="id"
      pagination={{ 
        pageSize: 10,
        showSizeChanger: true, 
        showTotal: (total) => `Всего: ${total} пользователей` 
      }}
    />
  );
};

