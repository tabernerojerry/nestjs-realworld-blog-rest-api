import { classToPlain } from 'class-transformer';
import * as slug from 'slug';
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, RelationCount } from 'typeorm';

import { IArticleResponse } from '../interfaces';
import { AbstractEntity } from './abstract.entity';
import { CommentEntity } from './comment.entity';
import { UserEntity } from './user.entity';

@Entity('articles')
export class ArticleEntity extends AbstractEntity {
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @ManyToMany((type) => UserEntity, (user) => user.favorites, { eager: true })
  @JoinTable()
  favoritedBy: UserEntity[];

  @ManyToOne((type) => UserEntity, (user) => user.articles, { eager: true })
  author: UserEntity;

  @RelationCount((article: ArticleEntity) => article.favoritedBy)
  favoritesCount: number;

  @Column('simple-array')
  tagList: string[];

  @OneToMany((type) => CommentEntity, (comment) => comment.article)
  comments: CommentEntity[];

  @BeforeInsert()
  generateSlug() {
    this.slug = slug(this.title, { lower: true }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }

  toJSON(): any {
    return classToPlain(this);
  }

  toArticle(currentUser?: UserEntity): IArticleResponse {
    let favorited = false;
    const article = this.toJSON();
    if (!!currentUser && !!article.favoritedBy.length) {
      favorited = article.favoritedBy.map((user: UserEntity) => user.id).includes(currentUser.id);
    }
    delete article.favoritedBy;
    return { ...article, favorited };
  }
}
