import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth';
import { ArticleEntity, UserEntity } from '../data/entities';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity]), AuthModule],
  providers: [ArticlesService],
  controllers: [ArticlesController],
})
export class ArticlesModule {}
