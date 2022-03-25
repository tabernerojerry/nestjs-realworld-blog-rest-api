import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '../data/entities';
import { IProfileResponse } from '../data/interfaces';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async findByUsername(username: string, currentUser?: UserEntity): Promise<IProfileResponse> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException();
    }

    return user.toProfile(currentUser);
  }

  public async followUser(currentUser: UserEntity, username: string): Promise<IProfileResponse> {
    const user = await this.userRepository.findOne({ where: { username }, relations: ['followers'] });

    if (!user) {
      throw new NotFoundException();
    }

    user.followers.push(currentUser);
    await user.save();
    return user.toProfile(currentUser);
  }

  public async unfollowUser(currentUser: UserEntity, username: string): Promise<IProfileResponse> {
    const user = await this.userRepository.findOne({ where: { username }, relations: ['followers'] });

    if (!user) {
      throw new NotFoundException();
    }

    user.followers = user.followers.filter((follower) => follower !== currentUser);
    await user.save();
    return user.toProfile(currentUser);
  }
}
