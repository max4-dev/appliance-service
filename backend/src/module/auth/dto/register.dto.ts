import { IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  login: string;

  @IsPhoneNumber('RU')
  phone: string;

  @IsString()
  @MinLength(8, { message: 'Пароль должен быть не менее 8 символов' })
  password: string;
}
