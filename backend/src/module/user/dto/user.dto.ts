import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class UserProfileDto {
  @IsOptional()
  @IsPhoneNumber('RU')
  phone?: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class UserPasswordDto {
  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
