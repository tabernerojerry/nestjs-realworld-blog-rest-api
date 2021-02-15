import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';

import { CurrentUser } from '../common/decorators';
import { JwtAuthGuard } from '../common/guards';
import { CreateArticleDto, UpdateArticleDto } from '../data/dto';
import { UserEntity } from '../data/entities';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Get('/:slug')
  public async findBySlug(@Param('slug') slug: string): Promise<any> {
    const article = await this.articleService.findBySlug(slug);
    return { article };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createArticle(
    @CurrentUser() currentUser: UserEntity,
    @Body('article', ValidationPipe) createArticleDto: CreateArticleDto,
  ): Promise<any> {
    const article = await this.articleService.createArticle(currentUser, createArticleDto);
    return { article };
  }

  @Put('/:slug')
  @UseGuards(JwtAuthGuard)
  public async updateArticle(
    @Param('slug') slug: string,
    @CurrentUser() currentUser: UserEntity,
    @Body('article', ValidationPipe) updateArticleDto: UpdateArticleDto,
  ): Promise<any> {
    const article = await this.articleService.updateArticle(slug, currentUser, updateArticleDto);
    return { article };
  }

  @Delete('/:slug')
  @UseGuards(JwtAuthGuard)
  public async deleteArticle(@Param('slug') slug: string, @CurrentUser() currentUser: UserEntity): Promise<any> {
    const article = await this.articleService.deleteArticle(slug, currentUser);
    return { article };
  }
}
