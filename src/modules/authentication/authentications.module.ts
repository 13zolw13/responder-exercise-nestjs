import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthenticationsController } from './authentications.controller';
import { AuthenticationsService } from './authentications.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthenticationsController],
  providers: [AuthenticationsService],
})
export class AuthenticationsModule {}
