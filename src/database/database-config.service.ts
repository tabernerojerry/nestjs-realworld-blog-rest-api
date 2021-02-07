import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import databaseConfig from '../config/database.config';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(databaseConfig.KEY)
    private dbConfig: ConfigType<typeof databaseConfig>,
  ) {}

  createTypeOrmOptions = (): TypeOrmModuleOptions => ({
    type: this.dbConfig.type,
    host: this.dbConfig.host,
    port: this.dbConfig.port,
    username: this.dbConfig.username,
    password: this.dbConfig.password,
    database: this.dbConfig.database,
    synchronize: true,
    dropSchema: false,
    logging: true,
    autoLoadEntities: true,
  });
}
