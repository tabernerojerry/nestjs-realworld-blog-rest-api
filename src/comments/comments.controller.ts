import { Body, Controller, Delete, Get, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';

import { CurrentUser } from '../common/decorators';
import { JwtAuthGuard } from '../common/guards';
import { CreateCommentDto } from '../data/dto';
import { UserEntity } from '../data/entities';
import { ICommentResponse, IResponseObject } from '../data/interfaces';
import { CommentsService } from './comments.service';

@Controller('articles')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('/:slug/comments')
  public async findComments(@Param('slug') slug: string): Promise<IResponseObject<'comments', ICommentResponse[]>> {
    const comments = await this.commentsService.findByArticleSlug(slug);
    return { comments };
  }

  @Post('/:slug/comments')
  @UseGuards(JwtAuthGuard)
  public async createComment(
    @CurrentUser() currentUser: UserEntity,
    @Body('comment', ValidationPipe) createCommentDto: CreateCommentDto,
  ): Promise<IResponseObject<'comment', ICommentResponse>> {
    const comment = await this.commentsService.createComment(currentUser, createCommentDto);
    return { comment };
  }

  @Delete('/:slug/comments/:id')
  @UseGuards(JwtAuthGuard)
  public async deleteComment(
    @CurrentUser() currentUser: UserEntity,
    @Param('id') id: number,
  ): Promise<IResponseObject<'comment', ICommentResponse>> {
    const comment = await this.commentsService.deleteComment(currentUser, id);
    return { comment };
  }
}
