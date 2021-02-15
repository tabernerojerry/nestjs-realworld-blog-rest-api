import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

import { LoginDto, RegisterDto } from '../data/dto';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  public async register(@Body(ValidationPipe) registerDto: { user: RegisterDto }): Promise<any> {
    return this.authService.register(registerDto.user);
  }

  @Post('/login')
  public async login(@Body(ValidationPipe) loginDto: { user: LoginDto }): Promise<any> {
    return this.authService.login(loginDto.user);
  }
}
