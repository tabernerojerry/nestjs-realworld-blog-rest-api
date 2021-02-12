import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from './entities';
import { IAuthPayload } from './interfaces';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Token'),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ username }: IAuthPayload) {
    const user = this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
