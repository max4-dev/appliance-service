export enum RequestStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  WAITING_PARTS = "WAITING_PARTS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum homeTechType {
  CONDITIONER = "CONDITIONER",
  SPLIT_SYSTEM = "SPLIT_SYSTEM",
  WINDOW_AC = "WINDOW_AC",
  CENTRAL_AC = "CENTRAL_AC",
  PORTABLE_AC = "PORTABLE_AC",
  HEAT_PUMP = "HEAT_PUMP",
  OTHER = "OTHER",
}

export const homeTechTypeLabels: Record<homeTechType, string> = {
  [homeTechType.CONDITIONER]: "Кондиционер",
  [homeTechType.SPLIT_SYSTEM]: "Сплит-система",
  [homeTechType.WINDOW_AC]: "Оконный кондиционер",
  [homeTechType.CENTRAL_AC]: "Центральное кондиционирование",
  [homeTechType.PORTABLE_AC]: "Мобильный кондиционер",
  [homeTechType.HEAT_PUMP]: "Тепловой насос",
  [homeTechType.OTHER]: "Другое",
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
  homeTechType: homeTechType;
  homeTechModel: string;
  problemDescription: string;
  startDate?: string;
  requestStatus?: RequestStatus;
}

export interface UpdateRequestDto {
  homeTechType?: homeTechType;
  homeTechModel?: string;
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
  homeTechType: homeTechType;
  homeTechModel: string;
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
