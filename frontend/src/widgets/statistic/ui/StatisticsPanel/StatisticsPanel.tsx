import { useGetStatistics } from "@/entities/statistic/model/hooks/useGetStatistics";
import { AlertOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Card, Col, Empty, Row, Spin, Statistic } from "antd";
import { FC } from "react";


export const StatisticsPanel: FC = () => {
  const { data: stats, isLoading } = useGetStatistics();

  if (isLoading) {
    return <Spin />;
  }

  if (!stats) {
    return <Empty description="Статистика недоступна" />;
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Всего заявок"
            value={stats.totalRequests}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Завершено"
            value={stats.completedRequests}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="В процессе"
            value={stats.inProgressRequests}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: "#faad14" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Ожидание запчастей"
            value={stats.waitingPartsRequests}
            prefix={<AlertOutlined />}
            valueStyle={{ color: "#f5222d" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Процент завершения"
            value={stats.completionRate}
            suffix="%"
            valueStyle={{ color: "#722ed1" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Среднее время ремонта"
            value={stats.averageRepairTime}
            suffix="ч"
            valueStyle={{ color: "#13c2c2" }}
          />
        </Card>
      </Col>
    </Row>
  );
};
