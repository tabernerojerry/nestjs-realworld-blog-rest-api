import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';

import { CurrentUser } from '../common/decorators';
import { JwtAuthGuard, OptionalAuthGuard } from '../common/guards';
import { CreateArticleDto, UpdateArticleDto } from '../data/dto';
import { UserEntity } from '../data/entities';
import { IArticleResponse, IFindAllQuery, IFindFeedQuery, IResponseObject } from '../data/interfaces';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  public async findAll(
    @CurrentUser() currentUser: UserEntity,
    @Query() query: IFindAllQuery,
  ): Promise<IResponseObject<'articles', IArticleResponse[]> & IResponseObject<'articlesCount', number>> {
    const articles = await this.articleService.findAll(currentUser, query);
    return {
      articles,
      articlesCount: articles.length,
    };
  }

  @Get('/feed')
  @UseGuards(JwtAuthGuard)
  public async findFeed(
    @CurrentUser() currentUser: UserEntity,
    @Query() query: IFindFeedQuery,
  ): Promise<IResponseObject<'articles', IArticleResponse[]> & IResponseObject<'articlesCount', number>> {
    const articles = await this.articleService.findFeed(currentUser, query);
    return {
      articles,
      articlesCount: articles.length,
    };
  }

  @Get('/:slug')
  @UseGuards(OptionalAuthGuard)
  public async findBySlug(
    @CurrentUser() currentUser: UserEntity,
    @Param('slug') slug: string,
  ): Promise<IResponseObject<'article', IArticleResponse>> {
    const article = await this.articleService.findBySlug(slug);
    return { article: article.toArticle(currentUser) };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createArticle(
    @CurrentUser() currentUser: UserEntity,
    @Body('article', ValidationPipe) createArticleDto: CreateArticleDto,
  ): Promise<IResponseObject<'article', IArticleResponse>> {
    const article = await this.articleService.createArticle(currentUser, createArticleDto);
    return { article };
  }

  @Put('/:slug')
  @UseGuards(JwtAuthGuard)
  public async updateArticle(
    @Param('slug') slug: string,
    @CurrentUser() currentUser: UserEntity,
    @Body('article', ValidationPipe) updateArticleDto: UpdateArticleDto,
  ): Promise<IResponseObject<'article', IArticleResponse>> {
    const article = await this.articleService.updateArticle(slug, currentUser, updateArticleDto);
    return { article };
  }

  @Delete('/:slug')
  @UseGuards(JwtAuthGuard)
  public async deleteArticle(
    @Param('slug') slug: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<IResponseObject<'article', IArticleResponse>> {
    const article = await this.articleService.deleteArticle(slug, currentUser);
    return { article };
  }

  @Post('/:slug/favorite')
  @UseGuards(JwtAuthGuard)
  public async favoriteArticle(
    @CurrentUser() currentUser: UserEntity,
    @Param('slug') slug: string,
  ): Promise<IResponseObject<'article', IArticleResponse>> {
    const article = await this.articleService.favoriteArticle(slug, currentUser);
    return { article };
  }

  @Delete('/:slug/favorite')
  @UseGuards(JwtAuthGuard)
  public async unfavoriteArticle(
    @CurrentUser() currentUser: UserEntity,
    @Param('slug') slug: string,
  ): Promise<IResponseObject<'article', IArticleResponse>> {
    const article = await this.articleService.unfavoriteArticle(slug, currentUser);
    return { article };
  }
}
