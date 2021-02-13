import { Repository } from 'typeorm';

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '../auth/entities';
import { UpdateUserDTO } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async findByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  public async updateUser(username: string, updateUserDto: UpdateUserDTO): Promise<UserEntity> {
    try {
      await this.userRepository.update({ username }, updateUserDto);
      return await this.findByUsername(username);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
