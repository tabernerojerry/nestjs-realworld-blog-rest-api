import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '../auth/entities';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async findByUsername(username: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException();
    }

    return { profile: { ...user.toJSON(), following: null } };
  }

  public async followUser(currentUser: UserEntity, username: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username }, relations: ['followers'] });
    user.followers.push(currentUser);
    await user.save();
    return { profile: user.toProfile(currentUser) };
  }

  public async unfollowUser(currentUser: UserEntity, username: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username }, relations: ['followers'] });
    user.followers = user.followers.filter((follower) => follower !== currentUser);
    await user.save();
    return { profile: user.toProfile(currentUser) };
  }
}
