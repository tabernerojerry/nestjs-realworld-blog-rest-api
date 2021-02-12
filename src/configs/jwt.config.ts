import { registerAs } from '@nestjs/config';

export const jsonWebTokenConfig = registerAs('jwtoken', () => ({
  secret: process.env.JWT_SECRET,
  expires: process.env.JWT_EXPIRES,
}));
