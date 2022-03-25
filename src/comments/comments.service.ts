import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateCommentDto } from '../data/dto';
import { CommentEntity, UserEntity } from '../data/entities';
import { ICommentResponse } from '../data/interfaces';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  public async findByArticleSlug(slug: string): Promise<ICommentResponse[]> {
    return await this.commentRepository.find({
      where: { 'article.slug': slug },
      relations: ['article'],
    });
  }

  public async findById(id: number): Promise<ICommentResponse> {
    return await this.commentRepository.findOne({ where: { id } });
  }

  public async createComment(currentUser: UserEntity, createCommentDto: CreateCommentDto): Promise<ICommentResponse> {
    const comment = this.commentRepository.create(createCommentDto);
    comment.author = currentUser;
    await comment.save();
    return await this.commentRepository.findOne({ where: { body: createCommentDto.body } });
  }

  public async deleteComment(currentUser: UserEntity, id: number): Promise<ICommentResponse> {
    const comment = await this.commentRepository.findOne({ where: { id, 'author.id': currentUser.id } });
    await comment.remove();
    return comment;
  }
}
