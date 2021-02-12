import { Repository } from 'typeorm';

import {
    ConflictException, Injectable, InternalServerErrorException, UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { LoginDTO, RegisterDTO } from './dto';
import { UserEntity } from './entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  public async register(registerDto: RegisterDTO): Promise<any> {
    try {
      const user = this.userRepository.create(registerDto);
      await this.userRepository.save(user);

      const jwtPayload = { id: user.id, username: user.username };
      const token = await this.jwtService.signAsync(jwtPayload);

      return { user: { ...user.toJSON(), token } };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username has already been taken.');
      }
      throw new InternalServerErrorException();
    }
  }

  public async login({ email, password }: LoginDTO): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      const isValid = await user.comparePassword(password);

      if (!isValid) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      const jwtPayload = { id: user.id, username: user.username };
      const token = this.jwtService.sign(jwtPayload);

      return { user: { ...user.toJSON(), token } };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }
}
