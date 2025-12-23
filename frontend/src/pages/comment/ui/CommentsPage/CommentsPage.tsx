import { useGetAllComments } from "@/entities/comment/model/hooks/useGetAllComments";
import { ArrowRightOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, List, Tag, Typography } from "antd";
import { FC } from "react";
import { Link } from "react-router";

const { Title } = Typography;

export const CommentsPage: FC = () => {
  const { data: comments = [], isLoading } = useGetAllComments();

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Последние комментарии</Title>
      <Card>
        <List
          loading={isLoading}
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={(item: any) => (
            <List.Item
              actions={[
                <Link key="view" to={`/requests/${item.requestId}`}>
                  <Button type="link" icon={<ArrowRightOutlined />}>
                    К заявке #{item.requestId}
                  </Button>
                </Link>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={
                  <span>
                    {item.master?.name || "Пользователь"} 
                    <span style={{ color: '#ccc', marginLeft: 8, fontSize: 12 }}>
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </span>
                }
                description={
                  <div>
                    <Tag>{item.request?.climateTechModel}</Tag>
                    <div style={{ marginTop: 4, color: '#333' }}>{item.message}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};
