import { IsString, IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  message: string;

  @IsInt()
  requestID: number;
}

export class UpdateCommentDto {
  @IsString()
  message: string;
}
