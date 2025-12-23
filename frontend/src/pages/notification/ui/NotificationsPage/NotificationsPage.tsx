import { useGetNotifications } from "@/entities/notification/model/hooks/useGetNotifications";
import { useMarkNotificationAsRead } from "@/entities/notification/model/hooks/useMarkNotificationAsRead";
import { Notification, NotificationType } from "@/entities/notification/model/types/notification";
import { BellOutlined, CheckOutlined } from "@ant-design/icons";
import { Button, Card, Empty, List, Skeleton, Tag, Typography } from "antd";
import { FC } from "react";


const { Title } = Typography;

export const NotificationsPage: FC = () => {
  const { data: notifications = [], isLoading } = useGetNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'STATUS_CHANGED': return 'blue';
      case 'ASSIGNED_TO_YOU': return 'gold';
      case 'COMMENT_ADDED': return 'green';
      default: return 'default';
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}><BellOutlined /> Уведомления</Title>
      </div>

      <Card>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : notifications.length === 0 ? (
          <Empty description="Новых уведомлений нет" />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={(item: Notification) => (
              <List.Item
                actions={[
                  !item.isRead && (
                    <Button 
                      type="link" 
                      icon={<CheckOutlined />} 
                      onClick={() => handleMarkAsRead(item.id)}
                      loading={markAsReadMutation.isPending}
                    >
                      Прочитано
                    </Button>
                  )
                ]}
                style={{ 
                  backgroundColor: item.isRead ? 'transparent' : '#f0faff',
                  padding: '12px',
                  borderRadius: '4px',
                  marginBottom: '8px'
                }}
              >
                <List.Item.Meta
                  title={
                    <span>
                      <Tag color={getNotificationColor(item.type)}>{item.type}</Tag>
                      {item.title}
                    </span>
                  }
                  description={
                    <div>
                      <div>{item.message}</div>
                      <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                        {new Date(item.createdAt).toLocaleString('ru-RU')}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};
