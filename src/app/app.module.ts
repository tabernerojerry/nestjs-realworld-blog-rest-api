import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ArticlesModule } from '../articles';
import { AuthModule } from '../auth';
import { appConfig } from '../configs';
import { DatabaseModule } from '../database';
import { ProfilesModule } from '../profiles';
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
    ArticlesModule,
  ],
})
export class AppModule {}
