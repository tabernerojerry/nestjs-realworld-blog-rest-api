import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TagEntity } from '../data/entities';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(TagEntity) private readonly tagRepository: Repository<TagEntity>) {}

  public async findTags(): Promise<string[]> {
    const tags = await this.tagRepository.find();
    return tags.map(({ tag }) => tag);
  }
}
