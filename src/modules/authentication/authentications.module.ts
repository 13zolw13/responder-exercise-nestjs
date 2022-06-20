import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthenticationsController } from './authentications.controller';
import { AuthenticationsService } from './authentications.service';
import { JwtAuthGuard } from './guards/authentication.jwt.guard';
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
  providers: [
    AuthenticationsService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthenticationsModule {}
