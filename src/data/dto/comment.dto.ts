import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  body: string;
}

export class CreateCommentBody {
  comment: CreateCommentDto;
}
