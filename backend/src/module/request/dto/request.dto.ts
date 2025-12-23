import { ClimateTechType, RequestStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  masterId: string;

  @IsEnum(ClimateTechType)
  climateTechType: ClimateTechType;

  @IsString()
  @IsNotEmpty()
  climateTechModel: string;

  @IsString()
  @IsNotEmpty()
  problemDescription: string;

  @IsString()
  @IsNotEmpty()
  startDate: Date;

  @IsString()
  @IsNotEmpty()
  requestStatus: RequestStatus;
}

export class UpdateRequestDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  problemDescription?: string;

  @IsOptional()
  @IsString()
  repairParts?: string;
}

export class UpdateRequestStatusDto {
  @IsEnum(RequestStatus)
  status: RequestStatus;
}
