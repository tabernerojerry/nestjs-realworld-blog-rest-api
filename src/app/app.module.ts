import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ArticlesModule } from '../articles';
import { AuthModule } from '../auth';
import { CommentsModule } from '../comments';
import { appConfig } from '../configs';
import { DatabaseModule } from '../database';
import { ProfilesModule } from '../profiles';
import { TagsModule } from '../tags';
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
    CommentsModule,
    TagsModule,
  ],
})
export class AppModule {}
