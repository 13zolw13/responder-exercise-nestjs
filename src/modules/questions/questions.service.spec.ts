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
    it('Should return empty array', async () => {
      const response = await service.getQuestions();
      expect(response).toMatchSnapshot();
    });

    it('should return array of questions', async () => {
      const fakeQuestion: CreateQuestionDto = {
        summary: faker.lorem.sentence(),
        author: faker.name.firstName() + ' ' + faker.name.lastName(),
      };
      await service.createQuestion(fakeQuestion);
      const response = await service.getQuestions();
      expect(response.length).toBeGreaterThan(0);
      expect(response).toBeInstanceOf(Array);
      expect(response).toContainEqual(expect.objectContaining(fakeQuestion));
    });
  });
  describe('FindQuestionById', () => {
    it('should return  search question', async () => {
      const fakeQuestion: CreateQuestionDto = {
        summary: faker.lorem.sentence(),
        author: faker.name.firstName() + ' ' + faker.name.lastName(),
      };
      const question = await service.createQuestion(fakeQuestion);
      expect(question).toBeDefined();

      const response = await service.findQuestionById(question.id);

      expect(response).toEqual(expect.objectContaining(fakeQuestion));
    });
    it(`should return undefined is question doesn't exists`, async () => {
      const fakeQuestion: CreateQuestionDto = {
        summary: faker.lorem.sentence(),
        author: faker.name.firstName() + ' ' + faker.name.lastName(),
      };
      const question = await service.createQuestion(fakeQuestion);
      expect(question).toBeDefined();

      const response = await service.findQuestionById(faker.datatype.uuid());
      console.log(response);
      expect(response).toBeUndefined();
    });

    it('should  throw error if id is not standard', async () => {
      const fakeQuestion: CreateQuestionDto = {
        summary: faker.lorem.sentence(),
        author: faker.name.firstName() + ' ' + faker.name.lastName(),
      };
      const question = await service.createQuestion(fakeQuestion);
      expect(question).toBeDefined();
      await expect(
        service.findQuestionById(question.id + 'a'),
      ).rejects.toThrow();
    });
  });
});
