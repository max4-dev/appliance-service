import { Button, Card, DatePicker, Form, Input, Select } from "antd";
import cn from "classnames";
import dayjs, { Dayjs } from "dayjs";
import styles from "./RequestForm.module.css";
import { useCreateRequest } from "@/entities/request/model/hooks/useCreateRequest";
import { CreateRequestDto, ClimateTechType, ClimateTechTypeLabels, RequestStatus, RequestStatusLabels } from "@/entities/request/model/types/request";
import { useClients } from "@/entities/user/model/useClients";
import { useSpecialists } from "@/entities/user/model/useSpecialists";

interface RequestFormProps {
  className?: string;
  onSuccess?: () => void;
}

interface FormValues extends Omit<CreateRequestDto, 'startDate'> {
  startDate: Dayjs;
}

export const RequestForm = ({ className, onSuccess }: RequestFormProps) => {
  const [form] = Form.useForm();
  
  const { mutate, isPending } = useCreateRequest();
  const { data: clientOptions, isLoading: isClientsLoading } = useClients();
  const { data: masterOptions, isLoading: isMastersLoading } = useSpecialists();

  const onFinish = (values: FormValues) => {
    const payload: CreateRequestDto = {
      ...values,
      startDate: values.startDate.toISOString(),
    };

    mutate(payload, {
      onSuccess: () => {
        form.resetFields();
        onSuccess?.();
      }
    });
  };

  const typeOptions = Object.values(ClimateTechType).map((type) => ({
    label: ClimateTechTypeLabels[type],
    value: type,
  }));

  const statusOptions = Object.values(RequestStatus).map((status) => ({
    label: RequestStatusLabels[status],
    value: status,
  }));

  return (
    <Card className={cn(styles.card, className)} title="Новая заявка" variant="borderless">
      <Form
        form={form}
        className={styles.form}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ 
          climateTechType: ClimateTechType.SPLIT_SYSTEM,
          requestStatus: RequestStatus.OPEN,
          startDate: dayjs()
        }}
      >
        <Form.Item
          label="Клиент"
          name="clientId"
          rules={[{ required: true, message: 'Выберите клиента' }]}
        >
          <Select 
            placeholder="Выберите клиента"
            options={clientOptions}
            loading={isClientsLoading}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          label="Мастер"
          name="masterId"
          rules={[{ required: true, message: 'Назначьте мастера' }]}
        >
          <Select 
            placeholder="Выберите мастера"
            options={masterOptions}
            loading={isMastersLoading}
          />
        </Form.Item>

        <Form.Item
          label="Дата начала"
          name="startDate"
          rules={[{ required: true, message: 'Выберите дату' }]}
        >
          <DatePicker 
            format="DD.MM.YYYY" 
            style={{ width: '100%' }} 
            allowClear={false}
          />
        </Form.Item>

        <Form.Item
          label="Статус"
          name="requestStatus"
          rules={[{ required: true, message: 'Выберите статус' }]}
        >
          <Select options={statusOptions} />
        </Form.Item>

        <Form.Item
          label="Тип оборудования"
          name="climateTechType"
          rules={[{ required: true, message: 'Выберите тип' }]}
        >
          <Select options={typeOptions} />
        </Form.Item>

        <Form.Item
          label="Модель"
          name="climateTechModel"
          rules={[{ required: true, message: 'Введите модель' }]}
        >
          <Input placeholder="Например, Samsung AQV09" />
        </Form.Item>

        <Form.Item
          label="Описание проблемы"
          name="problemDescription"
          rules={[{ required: true, message: 'Опишите проблему' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label={null}>
          <Button 
            size="large" 
            type="primary" 
            htmlType="submit" 
            loading={isPending}
            block
          >
            Создать заявку
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
