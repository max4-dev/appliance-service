import { useGetAllOrderedParts } from "@/entities/ordered-part/model/hooks/useGetAllOrderedParts";
import { SearchOutlined } from "@ant-design/icons";
import { Card, Input, Table, Tag, Typography } from "antd";
import { FC } from "react";

const { Title } = Typography;

export const OrderedPartsPage: FC = () => {
  const { data: allParts = [], isLoading } = useGetAllOrderedParts();

  const columns = [
    { title: "ID Заявки", dataIndex: "requestId", key: "requestId" },
    { title: "Название", dataIndex: "partName", key: "partName" },
    { title: "Артикул", dataIndex: "partNumber", key: "partNumber" },
    { title: "Поставщик", dataIndex: "supplier", key: "supplier" },
    { 
      title: "Статус", 
      dataIndex: "status", 
      key: "status",
      render: (status: string) => {
        let color = 'default';
        if (status === 'DELIVERED') color = 'green';
        if (status === 'ORDERED') color = 'blue';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    { title: "Дата заказа", dataIndex: "orderDate", key: "orderDate", render: (d: string) => new Date(d).toLocaleDateString() },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Управление запчастями</Title>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Input prefix={<SearchOutlined />} placeholder="Поиск по названию или артикулу" style={{ maxWidth: 300 }} />
        </div>
        <Table 
          dataSource={allParts} 
          columns={columns} 
          rowKey="id"
          loading={isLoading} 
        />
      </Card>
    </div>
  );
};
