import * as argon2 from 'argon2';
import { classToPlain, Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { IProfileResponse } from '../interfaces';
import { AbstractEntity } from './abstract.entity';
import { ArticleEntity } from './article.entity';
import { CommentEntity } from './comment.entity';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: null, nullable: true })
  image: string | null;

  @Column()
  @Exclude()
  password: string;

  @JoinTable()
  @ManyToMany((type) => UserEntity, (user) => user.follower)
  followers: UserEntity[];

  @ManyToMany((type) => UserEntity, (user) => user.followers)
  follower: UserEntity[];

  @OneToMany((type) => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @ManyToMany((type) => ArticleEntity, (article) => article.favoritedBy)
  favorites: ArticleEntity[];

  @OneToMany((type) => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await argon2.hash(this.password, { type: argon2.argon2id });
  }

  async comparePassword(password: string): Promise<boolean> {
    return await argon2.verify(this.password, password);
  }

  toJSON(): any {
    return classToPlain(this);
  }

  toProfile(currentUser?: UserEntity): IProfileResponse {
    let following = false;
    const profile = this.toJSON();
    if (!!currentUser && !!profile.followers.length) {
      following = profile.followers.includes(currentUser);
    }
    delete profile.followers;
    return { ...profile, following };
  }
}
