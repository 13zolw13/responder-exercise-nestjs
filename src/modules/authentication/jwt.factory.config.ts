import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (): JwtModuleOptions => {
  return {
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: '1d',
    },
  };
};
