import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthService } from '../auth';
import { UpdateUserDto } from '../data/dto';
import { UserEntity } from '../data/entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  public async findByUsername(username: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException();
    }

    const token = this.authService.createToken(user);

    return { user: { ...user.toJSON(), token } };
  }

  public async updateUser(username: string, updateUserDto: UpdateUserDto): Promise<any> {
    await this.userRepository.update({ username }, updateUserDto);
    const user = await this.userRepository.findOne({ where: { username } });

    const token = this.authService.createToken(user);

    return { user: { ...user.toJSON(), token } };
  }
}
