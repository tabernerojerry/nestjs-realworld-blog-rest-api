import { classToPlain } from 'class-transformer';
import * as slug from 'slug';
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, RelationCount } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
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

  @BeforeInsert()
  generateSlug() {
    this.slug = slug(this.title, { lower: true }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }

  toJSON(): Record<string, any> {
    return classToPlain(this);
  }

  toArticle(user?: UserEntity) {
    let favorited = null;

    if (user) {
      favorited = this.favoritedBy.includes(user);
    }

    const article = this.toJSON();
    delete article.favoritedBy;
    return { ...article, favorited };
  }
}
