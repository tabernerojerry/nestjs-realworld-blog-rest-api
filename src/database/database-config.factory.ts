import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { databaseConfig } from '../configs';

export const databaseConfigFactory = (dbConfig: ConfigType<typeof databaseConfig>): TypeOrmModuleOptions => ({
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  synchronize: true,
  dropSchema: false,
  logging: true,
  autoLoadEntities: true,
});
