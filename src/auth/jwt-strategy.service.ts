import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '../data/entities';
import { IJwtPayload } from '../data/interfaces';

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

  async validate({ username }: IJwtPayload) {
    const user = this.userRepository.findOne({ where: { username } });
    console.log('validate user', user);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
