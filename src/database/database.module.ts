import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseConfig } from '../configs';
import { DatabaseConfigService } from './database-config.service';

// import { databaseConfigFactory } from './database-config.factory';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      useClass: DatabaseConfigService,
      /**
       * If you prefer to use factory over useclass
       */
      // useFactory: databaseConfigFactory,
      // inject: [databaseConfig.KEY],
    }),
  ],
})
export class DatabaseModule {}
