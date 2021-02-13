import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';

import { UserEntity } from '../auth/entities';
import { CurrentUser } from '../common/decorators';
import { JwtAuthGuard } from '../common/guards';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('/:username')
  public async findByProfile(@Param('username') username: string): Promise<any> {
    return await this.profilesService.findByUsername(username);
  }

  @Post('/:username/follow')
  @UseGuards(JwtAuthGuard)
  public async followUser(@CurrentUser() currentUser: UserEntity, @Param('username') username: string): Promise<any> {
    return await this.profilesService.followUser(currentUser, username);
  }

  @Delete('/:username/follow')
  @UseGuards(JwtAuthGuard)
  public async unfollowUser(@CurrentUser() currentUser: UserEntity, @Param('username') username: string): Promise<any> {
    return await this.profilesService.unfollowUser(currentUser, username);
  }
}
