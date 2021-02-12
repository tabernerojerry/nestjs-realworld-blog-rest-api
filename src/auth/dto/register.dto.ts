import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { LoginDTO } from './login.dto';

export class RegisterDTO extends LoginDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;
}
