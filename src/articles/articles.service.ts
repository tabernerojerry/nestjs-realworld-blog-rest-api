import { Like, Repository } from 'typeorm';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateArticleDto, UpdateArticleDto } from '../data/dto';
import { ArticleEntity, TagEntity, UserEntity } from '../data/entities';
import { IArticleResponse, IFindAllQuery, IFindFeedQuery } from '../data/interfaces';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  public async findAll(currentUser: UserEntity, query: IFindAllQuery): Promise<IArticleResponse[]> {
    const findOptions: any = {
      where: {},
    };
    if (query.author) {
      findOptions.where['author.username'] = query.author;
    }
    if (query.favorited) {
      findOptions.where['favoritedBy.username'] = query.favorited;
    }
    if (query.tag) {
      findOptions.where.tagList = Like(`%${query.tag}%`);
    }
    if (query.offset) {
      findOptions.offset = query.offset;
    }
    if (query.limit) {
      findOptions.limit = query.limit;
    }
    return (await this.articleRepository.find(findOptions)).map((article) => article.toArticle(currentUser));
  }

  async findFeed(currentUser: UserEntity, query: IFindFeedQuery): Promise<IArticleResponse[]> {
    const { follower } = await this.userRepository.findOne({
      where: { id: currentUser.id },
      relations: ['follower'],
    });
    const findOptions = {
      ...query,
      where: follower.map(({ id }) => ({ author: id })),
    };
    return (await this.articleRepository.find(findOptions)).map((article) => article.toArticle(currentUser));
  }

  public async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({ where: { slug } });
  }

  public async createArticle(currentUser: UserEntity, createArticleDto: CreateArticleDto): Promise<IArticleResponse> {
    const article = this.articleRepository.create(createArticleDto);
    article.author = currentUser;
    await this.upsertTags(createArticleDto.tagList);
    const { slug } = await article.save();
    return (await this.articleRepository.findOne({ where: { slug } })).toArticle(currentUser);
  }

  public async updateArticle(
    slug: string,
    currentUser: UserEntity,
    updateArticleDto: UpdateArticleDto,
  ): Promise<IArticleResponse> {
    const article = await this.findBySlug(slug);

    if (!this.checkOwnership(currentUser, article)) {
      throw new UnauthorizedException();
    }

    await this.articleRepository.update({ slug }, updateArticleDto);
    return article.toArticle(currentUser);
  }

  public async deleteArticle(slug: string, currentUser: UserEntity): Promise<IArticleResponse> {
    const article = await this.findBySlug(slug);

    if (!this.checkOwnership(currentUser, article)) {
      throw new UnauthorizedException();
    }

    await this.articleRepository.remove(article);
    return article.toArticle(currentUser);
  }

  public async favoriteArticle(slug: string, currentUser: UserEntity): Promise<IArticleResponse> {
    const article = await this.findBySlug(slug);
    article.favoritedBy.push(currentUser);
    await article.save();
    return (await this.findBySlug(slug)).toArticle(currentUser);
  }

  public async unfavoriteArticle(slug: string, currentUser: UserEntity): Promise<IArticleResponse> {
    const article = await this.findBySlug(slug);
    article.favoritedBy = article.favoritedBy.filter(({ id }) => id !== currentUser.id);
    await article.save();
    return (await this.findBySlug(slug)).toArticle(currentUser);
  }

  private checkOwnership(currentUser: UserEntity, article: ArticleEntity): boolean {
    return article.author.id === currentUser.id;
  }

  private async upsertTags(tagList: string[]): Promise<void> {
    const foundTags = await this.tagRepository.find({
      where: tagList.map((tag) => ({ tag })),
    });

    const newTags = tagList.filter((filterTag) => foundTags.map(({ tag }) => tag).includes(filterTag));

    await Promise.all(this.tagRepository.create(newTags.map((tag) => ({ tag }))).map((tag) => tag.save()));
  }
}
