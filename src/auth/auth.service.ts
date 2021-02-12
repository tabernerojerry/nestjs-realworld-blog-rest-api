import { Injectable } from '@nestjs/common';

import { LoginDTO, RegisterDTO } from './dto';

@Injectable()
export class AuthService {
  public register(registerDto: RegisterDTO) {
    return {};
  }

  public login(loginDto: LoginDTO) {
    return {};
  }
}
