import { useGetRequestById } from "@/entities/request/model/hooks/useGetRequestById";
import { ClimateTechTypeLabels, RequestStatusLabels } from "@/entities/request/model/types/request";
import { AssignMasterForm } from "@/features/request/ui/AssignMasterForm/AssignMasterForm";
import { UpdateRequestForm } from "@/features/request/ui/UpdateRequestForm/UpdateRequestForm";
import { UpdateRequestStatusForm } from "@/features/request/ui/UpdateRequestStatusForm/UpdateRequestStatusForm";
import { CommentsSection } from "@/widgets/comment/ui/CommentsSection/CommentsSection";
import { OrderedPartsSection } from "@/widgets/ordered-part/ui/OrderedPartsSection/OrderedPartsSection";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Empty, Space, Spin, Tabs, Tag } from "antd";
import { FC, useState } from "react";
import { useNavigate, useParams } from "react-router";

interface Props {
  requestId: number;
  userId: string;
  userName: string;
  userRole: string;
  onBack: () => void;
}

export const RequestDetailPage: FC<Props> = ({
  requestId,
  userId,
  userName,
  userRole,
  onBack,
}) => {
  const { data: request, isLoading } = useGetRequestById(requestId);
  const [activeTab, setActiveTab] = useState("info");

  const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      OPEN: "blue",
      IN_PROGRESS: "orange",
      WAITING_PARTS: "purple",
      COMPLETED: "green",
      CANCELLED: "red",
    };
    return colorMap[status] || "default";
  };

  if (isLoading) {
    return <Spin />;
  }

  if (!request) {
    return <Empty description="Заявка не найдена" />;
  }

  const canEdit = ["ADMIN", "MANAGER", "SPECIALIST", "CLIENT"].includes(userRole);
  const canChangeStatus = ["ADMIN", "MANAGER", "SPECIALIST"].includes(userRole);
  const canAssignMaster = ["ADMIN", "MANAGER"].includes(userRole);

  return (
    <div style={{ padding: "20px 0" }}>
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
        >
          Назад
        </Button>
        <h2>Заявка #{requestId}</h2>
      </Space>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "info",
            label: "Информация",
            children: (
              <Card>
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="Номер заявки">
                    {request.id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Статус">
                    <Tag color={getStatusColor(request.requestStatus)}>
                      {RequestStatusLabels[request.requestStatus]}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Тип оборудования">
                    {ClimateTechTypeLabels[request.climateTechType]}
                  </Descriptions.Item>
                  <Descriptions.Item label="Модель">
                    {request.climateTechModel}
                  </Descriptions.Item>
                  <Descriptions.Item label="Клиент">
                    {request.client?.name || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Контакт клиента">
                    {request.client?.phone || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Мастер">
                    {request.master?.name || "Не назначен"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Дата создания">
                    {new Date(request.startDate).toLocaleDateString("ru-RU")}
                  </Descriptions.Item>
                  {request.completionDate && (
                    <Descriptions.Item label="Дата завершения">
                      {new Date(request.completionDate).toLocaleDateString("ru-RU")}
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="Описание проблемы" span={2}>
                    {request.problemDescription}
                  </Descriptions.Item>
                  {request.repairParts && (
                    <Descriptions.Item label="Замененные запчасти" span={2}>
                      {request.repairParts}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            ),
          },
          ...(canEdit
            ? [
                {
                  key: "edit",
                  label: "Редактировать",
                  children: (
                    <Card>
                      <UpdateRequestForm requestId={requestId} />
                    </Card>
                  ),
                },
              ]
            : []),
          ...(canChangeStatus
            ? [
                {
                  key: "status",
                  label: "Изменить статус",
                  children: (
                    <Card>
                      <UpdateRequestStatusForm
                        requestId={requestId}
                        userId={userId}
                      />
                    </Card>
                  ),
                },
              ]
            : []),
          ...(canAssignMaster
            ? [
                {
                  key: "assign",
                  label: "Назначить мастера",
                  children: (
                    <Card>
                      <AssignMasterForm requestId={requestId} />
                    </Card>
                  ),
                },
              ]
            : []),
          {
            key: "comments",
            label: "Комментарии",
            children: (
              <Card>
                <CommentsSection
                  requestId={requestId}
                  userId={userId}
                  userName={userName}
                  userRole={userRole}
                />
              </Card>
            ),
          },
          {
            key: "parts",
            label: "Запчасти",
            children: (
              <Card>
                <OrderedPartsSection requestId={requestId} userRole={userRole} />
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};



export const RequestDetailPageWrapper = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();

  if (!requestId) {
    return <div>Заявка не найдена</div>;
  }

  return (
    <RequestDetailPage
      requestId={parseInt(requestId)}
      userId="user-id"
      userName="User Name"
      userRole="ADMIN"
      onBack={() => navigate(-1)}
    />
  );
};