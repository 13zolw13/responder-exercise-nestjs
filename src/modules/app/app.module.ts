import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationsModule } from '../auth/authentications.module';
import { CaslModule } from '../auth/casl/casl.module';
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
    CaslModule,
  ],
})
export class AppModule {}
