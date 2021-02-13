import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  bio: string;
}
