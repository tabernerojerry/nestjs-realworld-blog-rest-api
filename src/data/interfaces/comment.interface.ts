import { UserEntity } from '../entities';
import { IProfileResponse } from './user.interface';

export interface ICommentResponse {
  id: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  body: string;
  author: IProfileResponse | UserEntity;
}
