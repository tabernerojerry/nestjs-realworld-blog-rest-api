import { Body, Controller, Get, Put, UseGuards, ValidationPipe } from '@nestjs/common';

import { CurrentUser } from '../common/decorators';
import { JwtAuthGuard } from '../common/guards';
import { UpdateUserDTO } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async findCurrentUser(@CurrentUser('username') username: string): Promise<any> {
    return await this.userService.findByUsername(username);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  public async updateUser(
    @CurrentUser('username') username: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true })) updateUserDto: UpdateUserDTO,
  ): Promise<any> {
    return await this.userService.updateUser(username, updateUserDto);
  }
}
