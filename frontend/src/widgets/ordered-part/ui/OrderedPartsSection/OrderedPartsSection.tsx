import { useCreateOrderedPart } from "@/entities/ordered-part/model/hooks/useCreateOrderedPart";
import { useOrderedParts } from "@/entities/ordered-part/model/hooks/useOrderedParts";
import { client } from "@/shared/api";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Empty, Form, Input, InputNumber, message, Modal, Space, Spin, Table } from "antd";
import { FC, useState } from "react";

interface Props {
  requestId: number;
  userRole: string;
}

export const OrderedPartsSection: FC<Props> = ({ requestId, userRole }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: orderedParts = [], isLoading } = useOrderedParts(requestId);
  const createPartMutation = useCreateOrderedPart();
  const queryClient = useQueryClient();

  const deletePartMutation = useMutation({
    mutationFn: (partId: string) =>
      client.delete(`/requests/${requestId}/ordered-parts/${partId}`),
    onSuccess: () => {
      message.success("Запчасть удалена");
      queryClient.invalidateQueries({ queryKey: ["ordered-parts", requestId] });
    },
    onError: () => {
      message.error("Ошибка при удалении запчасти");
    },
  });

  const onFinish = (values: any) => {
    createPartMutation.mutate(
      {
        requestId,
        data: {
          partName: values.partName,
          partNumber: values.partNumber,
          quantity: values.quantity || 1,
          unitPrice: values.unitPrice,
          supplier: values.supplier,
          expectedDeliveryDate: values.expectedDeliveryDate,
        },
      },
      {
        onSuccess: () => {
          form.resetFields();
          setIsModalVisible(false);
        },
      }
    );
  };

  const columns = [
    {
      title: "Название",
      dataIndex: "partName",
      key: "partName",
    },
    {
      title: "Артикул",
      dataIndex: "partNumber",
      key: "partNumber",
    },
    {
      title: "Количество",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Цена за ед.",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price: number) => `${price ? price.toFixed(2) : "—"} ₽`,
    },
    {
      title: "Сумма",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: number) => `${price ? price.toFixed(2) : "—"} ₽`,
    },
    {
      title: "Поставщик",
      dataIndex: "supplier",
      key: "supplier",
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Действия",
      key: "actions",
      render: (text: any, record: any) => (
        <Button
          type="primary"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => deletePartMutation.mutate(record.id)}
          loading={deletePartMutation.isPending}
        />
      ),
    },
  ];

  if (isLoading) {
    return <Spin />;
  }

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <h3>Заказанные запчасти</h3>
        {["SPECIALIST", "MANAGER", "ADMIN"].includes(userRole) && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Добавить запчасть
          </Button>
        )}
      </div>

      {orderedParts.length === 0 ? (
        <Empty description="Нет заказанных запчастей" />
      ) : (
        <Table
          columns={columns}
          dataSource={orderedParts}
          pagination={{ pageSize: 5 }}
          rowKey="id"
          size="middle"
        />
      )}

      <Modal
        title="Добавить запчасть"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Название запчасти"
            name="partName"
            rules={[{ required: true, message: "Обязательное поле" }]}
          >
            <Input placeholder="Введите название запчасти" />
          </Form.Item>

          <Form.Item label="Артикул" name="partNumber">
            <Input placeholder="Введите артикул (опционально)" />
          </Form.Item>

          <Form.Item label="Количество" name="quantity" initialValue={1}>
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item label="Цена за единицу" name="unitPrice">
            <InputNumber min={0} precision={2} />
          </Form.Item>

          <Form.Item label="Поставщик" name="supplier">
            <Input placeholder="Введите поставщика (опционально)" />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" loading={createPartMutation.isPending}>
              Добавить
            </Button>
            <Button onClick={() => setIsModalVisible(false)}>Отмена</Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};
