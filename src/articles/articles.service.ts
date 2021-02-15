import { Repository } from 'typeorm';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateArticleDto, UpdateArticleDto } from '../data/dto';
import { ArticleEntity, UserEntity } from '../data/entities';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({ where: { slug } });
  }

  public async createArticle(user: UserEntity, createArticleDto: CreateArticleDto): Promise<any> {
    const article = this.articleRepository.create(createArticleDto);
    article.author = user;
    const { slug } = await article.save();
    return (await this.articleRepository.findOne({ where: { slug } })).toArticle(user);
  }

  public async updateArticle(slug: string, user: UserEntity, updateArticleDto: UpdateArticleDto): Promise<any> {
    const article = await this.findBySlug(slug);
    if (!this.checkOwnership(user, article)) {
      throw new UnauthorizedException();
    }
    await this.articleRepository.update({ slug }, updateArticleDto);
    return article.toArticle(user);
  }

  public async deleteArticle(slug: string, user: UserEntity): Promise<any> {
    const article = await this.findBySlug(slug);
    if (!this.checkOwnership(user, article)) {
      throw new UnauthorizedException();
    }
    await this.articleRepository.remove(article);
    return article.toArticle(user);
  }

  private checkOwnership(user: UserEntity, article: ArticleEntity): boolean {
    return article.author.id === user.id;
  }
}
