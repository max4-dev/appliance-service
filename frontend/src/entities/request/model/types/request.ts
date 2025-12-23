export enum RequestStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  WAITING_PARTS = "WAITING_PARTS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum ClimateTechType {
  CONDITIONER = "CONDITIONER",
  SPLIT_SYSTEM = "SPLIT_SYSTEM",
  WINDOW_AC = "WINDOW_AC",
  CENTRAL_AC = "CENTRAL_AC",
  PORTABLE_AC = "PORTABLE_AC",
  HEAT_PUMP = "HEAT_PUMP",
  OTHER = "OTHER",
}

export const ClimateTechTypeLabels: Record<ClimateTechType, string> = {
  [ClimateTechType.CONDITIONER]: "Кондиционер",
  [ClimateTechType.SPLIT_SYSTEM]: "Сплит-система",
  [ClimateTechType.WINDOW_AC]: "Оконный кондиционер",
  [ClimateTechType.CENTRAL_AC]: "Центральное кондиционирование",
  [ClimateTechType.PORTABLE_AC]: "Мобильный кондиционер",
  [ClimateTechType.HEAT_PUMP]: "Тепловой насос",
  [ClimateTechType.OTHER]: "Другое",
};

export const RequestStatusLabels: Record<RequestStatus, string> = {
  [RequestStatus.OPEN]: "Открыта",
  [RequestStatus.IN_PROGRESS]: "В процессе",
  [RequestStatus.WAITING_PARTS]: "Ожидание запчастей",
  [RequestStatus.COMPLETED]: "Завершена",
  [RequestStatus.CANCELLED]: "Отменена",
};

export interface CreateRequestDto {
  clientId: string;
  masterId?: string;
  climateTechType: ClimateTechType;
  climateTechModel: string;
  problemDescription: string;
  startDate?: string;
  requestStatus?: RequestStatus;
}

export interface UpdateRequestDto {
  climateTechType?: ClimateTechType;
  climateTechModel?: string;
  problemDescription?: string;
  repairParts?: string;
}

export interface UpdateRequestStatusDto {
  newStatus: RequestStatus;
  reason?: string;
  changedById?: string;
}

export interface Request {
  id: number;
  clientID: string;
  masterID?: string;
  startDate: string;
  completionDate?: string;
  climateTechType: ClimateTechType;
  climateTechModel: string;
  problemDescription: string;
  requestStatus: RequestStatus;
  repairParts?: string;
  client?: {
    id: string;
    name: string;
    phone: string;
    login: string;
  };
  master?: {
    id: string;
    name: string;
    phone: string;
    login: string;
  };
  comments?: Comment[];
  statusHistories?: unknown[];
  orderedParts?: unknown[];
}
