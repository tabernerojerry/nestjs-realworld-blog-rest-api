import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

import { jsonWebTokenConfig } from '../configs';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(
    @Inject(jsonWebTokenConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof jsonWebTokenConfig>,
  ) {}

  createJwtOptions = (): JwtModuleOptions | Promise<JwtModuleOptions> => ({
    secret: this.jwtConfig.secret,
    signOptions: {
      expiresIn: this.jwtConfig.expires,
    },
  });
}
