import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './dto';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  public async register(@Body(ValidationPipe) registerDto: RegisterDTO): Promise<any> {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  public async login(@Body(ValidationPipe) loginDto: LoginDTO): Promise<any> {
    return this.authService.login(loginDto);
  }
}
