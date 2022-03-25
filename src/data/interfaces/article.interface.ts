import { IProfileResponse } from './user.interface';

export interface IFindFeedQuery {
  limit?: number;
  offset?: number;
}

export interface IFindAllQuery extends IFindFeedQuery {
  tag?: string;
  author?: string;
  favorited?: string;
}

export interface IArticleResponse {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  favorited: boolean | null;
  favoritesCount: number;
  author: IProfileResponse;
}
