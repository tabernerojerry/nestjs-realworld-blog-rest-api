export interface IUserResponse {
  email: string;
  username?: string;
  bio: string;
  image: string | null;
}

export interface IAuthResponse extends IUserResponse {
  token: string;
}

export interface IProfileResponse extends IUserResponse {
  following: boolean | null;
}
