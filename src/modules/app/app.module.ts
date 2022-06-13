import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationsModule } from '../authentication/authentications.module';
import { DatabaseModule } from '../database/database.module';
import { QuestionsModule } from '../questions/questions.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      cache: true,
    }),
    DatabaseModule,
    QuestionsModule,
    UsersModule,
    AuthenticationsModule,
  ],
})
export class AppModule {}
