import { Repository } from 'typeorm';

import {
    ConflictException, Injectable, InternalServerErrorException, UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LoginDTO, RegisterDTO } from './dto';
import { UserEntity } from './entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async register(registerDto: RegisterDTO): Promise<UserEntity> {
    try {
      const user = this.userRepository.create(registerDto);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username has already been taken.');
      }
      throw new InternalServerErrorException();
    }
  }

  public async login({ email, password }: LoginDTO): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      const isValid = await user.comparePassword(password);

      if (!isValid) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }
}
