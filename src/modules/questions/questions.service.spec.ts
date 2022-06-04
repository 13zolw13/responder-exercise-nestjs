import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { Question } from './entities/question.entity';
import { QuestionsService } from './questions.service';

describe('QuestionsService', () => {
  let service: QuestionsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env'],
          isGlobal: true,
          cache: true,
        }),
        DatabaseModule,
        TypeOrmModule.forFeature([Question]),
      ],
      providers: [QuestionsService],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Name of the group', () => {
    it('should be defined', async () => {
      const response = await service.getQuestions();
      expect(response).toStrictEqual([]);
    });
  });
});
