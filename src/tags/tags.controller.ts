import { Controller, Get } from '@nestjs/common';

import { IResponseObject } from '../data/interfaces';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  public async findTags(): Promise<IResponseObject<'tags', string[]>> {
    const tags = await this.tagsService.findTags();
    return { tags };
  }
}
