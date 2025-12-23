import { useRequests } from "@/entities/request/model/hooks/useRequests";
import {
  ClimateTechTypeLabels,
  RequestStatus,
  RequestStatusLabels
} from "@/entities/request/model/types/request";
import { SearchOutlined } from "@ant-design/icons";
import { Card, Input, Table, Tag } from "antd";
import { useState } from "react";
import styles from "./RequestList.module.css";

const { Search } = Input;

export const RequestList = () => {
  const [search, setSearch] = useState<string>("");
  
  const { data: requests, isLoading } = useRequests(search);

  const onSearch = (value: string) => {
    setSearch(value);
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.COMPLETED: return 'green';
      case RequestStatus.IN_PROGRESS: return 'blue';
      case RequestStatus.WAITING_PARTS: return 'orange';
      case RequestStatus.CANCELLED: return 'red';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: '№',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Дата',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Оборудование',
      key: 'equipment',
      render: (_: any, record: Request) => (
        <>
          <div><b>{ClimateTechTypeLabels[record.climateTechType]}</b></div>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.climateTechModel}</div>
        </>
      ),
    },
    {
      title: 'Клиент',
      dataIndex: ['client', 'name'],
      key: 'clientName',
      render: (text: string, record: Request) => (
         <div>
            <div>{text}</div>
            <div style={{fontSize: '11px', color: '#aaa'}}>{record.client?.phone}</div>
         </div>
      )
    },
    {
      title: 'Статус',
      dataIndex: 'requestStatus',
      key: 'requestStatus',
      render: (status: RequestStatus) => (
        <Tag color={getStatusColor(status)}>
          {RequestStatusLabels[status]}
        </Tag>
      )
    },
    {
        title: 'Мастер',
        dataIndex: ['master', 'name'], 
        key: 'masterName',
        render: (text: string | null | undefined) => {
            return text ? text : <span style={{color: '#ccc'}}>Не назначен</span>;
        }
    },
  ];

  return (
    <Card className={styles.listCard} title="Список заявок">
      <div className={styles.header}>
        <Search
            placeholder="Поиск по номеру, модели или клиенту"
            onSearch={onSearch}
            enterButton={<SearchOutlined />}
            style={{ width: 350, marginBottom: 20 }}
        />
      </div>
      <Table
        dataSource={requests}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};
