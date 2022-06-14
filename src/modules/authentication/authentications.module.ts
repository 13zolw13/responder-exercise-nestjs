import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthenticationsController } from './authentications.controller';
import { AuthenticationsService } from './authentications.service';
import { jwtConfig } from './jwt.factory.config';
import { JwtStrategy } from './strategies/authentication.jwt.strategy';
import { LocalStrategy } from './strategies/authentication.local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: jwtConfig,
    }),
  ],
  controllers: [AuthenticationsController],
  providers: [AuthenticationsService, LocalStrategy, JwtStrategy],
})
export class AuthenticationsModule {}
