import { Controller, Get, Param } from '@nestjs/common';

import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('/:username')
  public async findByProfile(@Param('username') username: string): Promise<any> {
    return await this.profilesService.findByUsername(username);
  }
}
