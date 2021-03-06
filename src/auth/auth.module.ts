import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { jsonWebTokenConfig } from '../configs';
import { UserEntity } from '../data/entities';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtConfigService } from './jwt-config.service';
import { JwtStrategyService } from './jwt-strategy.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jsonWebTokenConfig)],
      useClass: JwtConfigService,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategyService],
  exports: [PassportModule, JwtStrategyService, AuthService],
})
export class AuthModule {}
