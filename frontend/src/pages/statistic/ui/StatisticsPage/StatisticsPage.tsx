import { useGetStatistics } from "@/entities/statistic/model/hooks/useGetStatistics";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  SyncOutlined
} from "@ant-design/icons";
import { Card, Col, Row, Spin, Statistic, Typography } from "antd";
import { FC } from "react";

const { Title } = Typography;

export const StatisticsPage: FC = () => {
  const { data: stats, isLoading } = useGetStatistics();

  if (isLoading) {
    return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
  }

  const safeStats = stats || {
    totalRequests: 0,
    completedRequests: 0,
    inProgressRequests: 0,
    averageRepairTime: 0
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Статистика сервисного центра</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="Всего заявок"
              value={safeStats.totalRequests}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="В работе"
              value={safeStats.inProgressRequests}
              prefix={<SyncOutlined spin />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="Завершено"
              value={safeStats.completedRequests}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="Ср. время ремонта (дни)"
              value={safeStats.averageRepairTime || 0}
              precision={1}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <Card title="Эффективность отдела">
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            Графики эффективности будут доступны в следующей версии
          </div>
        </Card>
      </div>
    </div>
  );
};
