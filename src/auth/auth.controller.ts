import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

import { LoginDto, RegisterDto } from '../data/dto';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  public async register(@Body('user', ValidationPipe) registerDto: RegisterDto): Promise<any> {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  public async login(@Body('user', ValidationPipe) loginDto: LoginDto): Promise<any> {
    return await this.authService.login(loginDto);
  }
}
