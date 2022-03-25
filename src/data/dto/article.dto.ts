import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  tagList: string[];
}

export class UpdateArticleDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  body: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagList: string[];
}

export class CreateArticleBody {
  article: CreateArticleDto;
}

export class UpdateArticleBody {
  article: UpdateArticleDto;
}
