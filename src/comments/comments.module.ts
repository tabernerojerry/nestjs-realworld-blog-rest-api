import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth';
import { ArticleEntity, CommentEntity, UserEntity } from '../data/entities';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, ArticleEntity, UserEntity]), AuthModule],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
