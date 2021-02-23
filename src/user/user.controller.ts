import { Body, Controller, Get, Put, UseGuards, ValidationPipe } from '@nestjs/common';

import { CurrentUser } from '../common/decorators';
import { JwtAuthGuard } from '../common/guards';
import { UpdateUserDto } from '../data/dto';
import { IAuthResponse, IResponseObject } from '../data/interfaces';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async findCurrentUser(
    @CurrentUser('username') username: string,
  ): Promise<IResponseObject<'user', IAuthResponse>> {
    const user = await this.userService.findCurrentUser(username);
    return { user };
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  public async updateUser(
    @CurrentUser('username') username: string,
    @Body('user', new ValidationPipe({ transform: true, whitelist: true })) updateUserDto: UpdateUserDto,
  ): Promise<IResponseObject<'user', IAuthResponse>> {
    const user = await this.userService.updateUser(username, updateUserDto);
    return { user };
  }
}
