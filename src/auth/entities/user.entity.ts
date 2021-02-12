import * as argon2 from 'argon2';
import { classToPlain, Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity } from 'typeorm';

import { AbstractEntity } from './abstract.entity';

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
}
