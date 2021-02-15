import { IsArray, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  body: string;

  @IsArray()
  @IsString({ each: true })
  tagList: string[];
}
