import { faker } from '@faker-js/faker';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cleanupBeforeEachSpec } from '../../utils/dbCleaner';
import { DatabaseModule } from '../database/database.module';
import { CreateQuestionDto } from './dto/questionDto';
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
  cleanupBeforeEachSpec();
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createQuestion', () => {
    it('should add new question', async () => {
      const fakeQuestion: CreateQuestionDto = {
        summary: faker.lorem.sentence(),
        author: faker.name.firstName(),
      };

      const response = await service.createQuestion(fakeQuestion);
      expect(response).toEqual(expect.objectContaining(fakeQuestion));
    });
  });
  describe('GetQuestions', () => {
    describe('Empty db', () => {
      it('Should return empty array', async () => {
        const response = await service.getQuestions();
        expect(response).toMatchSnapshot();
      });
    });
  });
});
