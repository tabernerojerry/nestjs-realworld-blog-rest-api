import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @MinLength(4)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
