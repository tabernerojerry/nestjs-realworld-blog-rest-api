import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth';
import { appConfig } from '../configs';
import { DatabaseModule } from '../database';
import { ProfilesModule } from '../profiles/profiles.module';
import { UserModule } from '../user';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    ProfilesModule,
  ],
})
export class AppModule {}
