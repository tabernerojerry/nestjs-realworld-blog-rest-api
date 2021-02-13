import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { databaseConfig } from '../configs';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(databaseConfig.KEY)
    private readonly dbConfig: ConfigType<typeof databaseConfig>,
  ) {}

  createTypeOrmOptions = (): TypeOrmModuleOptions => ({
    type: this.dbConfig.type,
    host: this.dbConfig.host,
    port: this.dbConfig.port,
    username: this.dbConfig.username,
    password: this.dbConfig.password,
    database: this.dbConfig.database,
    synchronize: true,
    dropSchema: true, //NOTE: Set this option to false in production,
    logging: true,
    autoLoadEntities: true,
  });
}
