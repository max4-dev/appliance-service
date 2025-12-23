import {
  IsString,
  IsInt,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateOrderedPartDto {
  @IsString()
  partName: string;

  @IsString()
  @IsOptional()
  partNumber?: string;

  @IsInt()
  quantity: number = 1;

  @IsNumber()
  @IsOptional()
  unitPrice?: number;

  @IsNumber()
  @IsOptional()
  totalPrice?: number;

  @IsString()
  @IsOptional()
  supplier?: string;

  @IsDateString()
  @IsOptional()
  expectedDeliveryDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsInt()
  requestId: number;
}

export class UpdateOrderedPartDto {
  @IsString()
  @IsOptional()
  partName?: string;

  @IsString()
  @IsOptional()
  partNumber?: string;

  @IsInt()
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @IsOptional()
  unitPrice?: number;

  @IsNumber()
  @IsOptional()
  totalPrice?: number;

  @IsString()
  @IsOptional()
  supplier?: string;

  @IsDateString()
  @IsOptional()
  expectedDeliveryDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdatePartStatusDto {
  @IsString()
  status: string;
}
