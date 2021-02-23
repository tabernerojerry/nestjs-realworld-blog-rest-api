import { Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../common/decorators';
import { JwtAuthGuard, OptionalAuthGuard } from '../common/guards';
import { UserEntity } from '../data/entities';
import { IProfileResponse, IResponseObject } from '../data/interfaces';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('/:username')
  @UseGuards(OptionalAuthGuard)
  public async findProfile(
    @CurrentUser() currentUser: UserEntity,
    @Param('username') username: string,
  ): Promise<IResponseObject<'profile', IProfileResponse>> {
    const profile = await this.profilesService.findByUsername(username, currentUser);
    return { profile };
  }

  @Post('/:username/follow')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  public async followUser(
    @CurrentUser() currentUser: UserEntity,
    @Param('username') username: string,
  ): Promise<IResponseObject<'profile', IProfileResponse>> {
    const profile = await this.profilesService.followUser(currentUser, username);
    return { profile };
  }

  @Delete('/:username/follow')
  @UseGuards(JwtAuthGuard)
  public async unfollowUser(
    @CurrentUser() currentUser: UserEntity,
    @Param('username') username: string,
  ): Promise<IResponseObject<'profile', IProfileResponse>> {
    const profile = await this.profilesService.unfollowUser(currentUser, username);
    return { profile };
  }
}
