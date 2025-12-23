export interface CreateCommentDto {
  message: string;
}

export interface Comment {
  id: number;
  message: string;
  requestID: number;
  masterID: string;
  createdAt: string;
  updatedAt: string;
  master: {
    id: string;
    name: string;
    phone?: string;
  };
}

export interface CreateCommentDto {
  message: string;
}
