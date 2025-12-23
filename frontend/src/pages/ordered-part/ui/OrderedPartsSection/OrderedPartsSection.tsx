import { useCreateOrderedPart } from "@/entities/ordered-part/model/hooks/useCreateOrderedPart";
import { useOrderedParts } from "@/entities/ordered-part/model/hooks/useOrderedParts";
import { PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Space, Table, Tag, Typography } from "antd";
import { FC, useState } from "react";


interface Props {
  requestId: number;
  userRole: string;
}

export const OrderedPartsSection: FC<Props> = ({ requestId, userRole }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  const { data: parts = [], isLoading } = useOrderedParts(requestId);
  const createPartMutation = useCreateOrderedPart();

  const handleCreate = (values: any) => {
    createPartMutation.mutate(
      { requestId, data: values },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          form.resetFields();
        }
      }
    );
  };

  const columns = [
    { title: "Название", dataIndex: "partName", key: "partName" },
    { title: "Артикул", dataIndex: "partNumber", key: "partNumber" },
    { title: "Кол-во", dataIndex: "quantity", key: "quantity" },
    { 
      title: "Цена за шт.", 
      dataIndex: "unitPrice", 
      key: "unitPrice",
      render: (val: number) => val ? `${val} ₽` : '-' 
    },
    { 
      title: "Статус", 
      dataIndex: "status", 
      key: "status",
      render: (status: string) => <Tag color="blue">{status}</Tag>
    },
  ];

  const canAddParts = ["ADMIN", "MANAGER", "SPECIALIST"].includes(userRole);

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          <ShoppingCartOutlined /> Заказанные запчасти
        </Typography.Title>
        {canAddParts && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Добавить запчасть
          </Button>
        )}
      </div>

      <Table 
        dataSource={parts} 
        columns={columns} 
        rowKey="id" 
        loading={isLoading}
        pagination={false}
        locale={{ emptyText: "Запчасти не заказаны" }}
      />

      <Modal
        title="Заказ запчасти"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="partName" label="Название" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="partNumber" label="Артикул">
            <Input />
          </Form.Item>
          <Space>
            <Form.Item name="quantity" label="Количество" initialValue={1} rules={[{ required: true }]}>
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item name="unitPrice" label="Цена (₽)">
              <InputNumber min={0} step={100} />
            </Form.Item>
          </Space>
          <Form.Item name="supplier" label="Поставщик">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={createPartMutation.isPending}>
            Добавить в заказ
          </Button>
        </Form>
      </Modal>
    </div>
  );
};
