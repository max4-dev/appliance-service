import { useGetUsers } from "@/entities/user/model/useGetUsers";
import { User } from "@/entities/user/types/user";
import { CreateUserForm } from "@/features/user/ui/CreateUserForm/CreateUserForm";
import { UpdateUserRoleForm } from "@/features/user/ui/UpdateUserRoleForm.tsx/UpdateUserRoleForm";
import { UsersTable } from "@/widgets/user/ui/UsersTable/UsersTable";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Modal, Typography } from "antd";
import { FC, useState } from "react";


const { Title } = Typography;

export const UsersManagementPage: FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data: users = [], isLoading } = useGetUsers();

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
  };

  const handleEditSuccess = () => {
    setEditingUser(null);
  };

  return (
    <div style={{ padding: "0 24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Управление пользователями
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalOpen(true)}
          size="large"
        >
          Добавить пользователя
        </Button>
      </div>
      <Card bordered={false} className="shadow-sm">
        <UsersTable
          users={users}
          loading={isLoading}
          onEdit={handleEditUser}
        />
      </Card>

      <Modal
        title="Новый пользователь"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <CreateUserForm onSuccess={handleCreateSuccess} />
      </Modal>

      <Modal
        title={`Изменение роли: ${editingUser?.name || ""}`}
        open={!!editingUser}
        onCancel={() => setEditingUser(null)}
        footer={null}
        destroyOnClose
      >
        {editingUser && (
          <UpdateUserRoleForm
            userId={editingUser.id}
            onSuccess={handleEditSuccess}
          />
        )}
      </Modal>
    </div>
  );
};
