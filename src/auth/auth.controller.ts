import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

import { LoginDto, RegisterDto } from '../data/dto';
import { IAuthResponse, IResponseObject } from '../data/interfaces';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  public async register(
    @Body('user', ValidationPipe) registerDto: RegisterDto,
  ): Promise<IResponseObject<'user', IAuthResponse>> {
    const user = await this.authService.register(registerDto);
    return { user };
  }

  @Post('/login')
  public async login(
    @Body('user', ValidationPipe) loginDto: LoginDto,
  ): Promise<IResponseObject<'user', IAuthResponse>> {
    const user = await this.authService.login(loginDto);
    return { user };
  }
}
