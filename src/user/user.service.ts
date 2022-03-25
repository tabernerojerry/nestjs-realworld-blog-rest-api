import { Repository } from 'typeorm';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthService } from '../auth';
import { UpdateUserDto } from '../data/dto';
import { UserEntity } from '../data/entities';
import { IAuthResponse } from '../data/interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  public async findCurrentUser(username: string): Promise<IAuthResponse> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException();
    }

    const token = this.authService.createToken(user);

    return { ...user.toJSON(), token };
  }

  public async updateUser(username: string, updateUserDto: UpdateUserDto): Promise<IAuthResponse> {
    await this.userRepository.update({ username }, updateUserDto);
    const user = await this.userRepository.findOne({ where: { username } });

    const token = this.authService.createToken(user);

    return { ...user.toJSON(), token };
  }
}
