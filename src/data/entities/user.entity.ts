import * as argon2 from 'argon2';
import { classToPlain, Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { ArticleEntity } from './article.entity';

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
  @JoinColumn()
  favorites: ArticleEntity[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await argon2.hash(this.password, { type: argon2.argon2id });
  }

  async comparePassword(password: string): Promise<boolean> {
    return await argon2.verify(this.password, password);
  }

  toJSON(): Record<string, any> {
    return classToPlain(this);
  }

  toProfile(currentUser: UserEntity) {
    const following = this.followers.includes(currentUser);
    const profile = this.toJSON();
    delete profile.followers;
    return { ...profile, following };
  }
}
