import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import { CreateQuestionDto } from '../src/modules/questions/dto/questionDto';
import { cleanupBeforeEachSpec } from '../src/utils/dbCleaner';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const appGet = () => request(app.getHttpServer());
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return appGet().get('/').expect(200).expect('Hello World!');
  });
  cleanupBeforeEachSpec();

  describe('/questions', () => {
    describe('POST', () => {
      it('should add new question', async () => {
        const fakeQuestion: CreateQuestionDto = {
          summary: 'test',
          author: 'John Doe',
        };
        return appGet().post('/questions').send(fakeQuestion).expect(201);
      });
    });
    describe('(GET)', () => {
      it('should return empty table', async () => {
        return appGet().get('/questions').expect(200).expect([]);
      });
      it('should return array of questions', async () => {
        const fakeQuestion: CreateQuestionDto = {
          summary: faker.lorem.sentence() + '?',
          author: faker.name.firstName() + ' ' + faker.name.lastName(),
        };
        await appGet().post('/questions').send(fakeQuestion).expect(201);
        const response = await appGet().get('/questions');
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toEqual([
          expect.objectContaining({ ...fakeQuestion }),
        ]);
      });
    });
  });
  describe('/questions/:questionsId', () => {
    describe('GET', () => {
      it('should return question', async () => {
        const fakeQuestion: CreateQuestionDto = {
          summary: faker.lorem.sentence() + '?',
          author: faker.name.firstName() + ' ' + faker.name.lastName(),
        };
        const question = await appGet()
          .post('/questions')
          .send(fakeQuestion)
          .expect(201);
        const questionId = question.body.id;
        const response = await appGet()
          .get(`/questions/${questionId}`)
          .expect(200);
        console.log(response.body);
        expect(response.body).toEqual(expect.objectContaining(fakeQuestion));
      });
    });
    it('should throw error-wrong id', async () => {
      const fakeQuestion: CreateQuestionDto = {
        summary: faker.lorem.sentence() + '?',
        author: faker.name.firstName() + ' ' + faker.name.lastName(),
      };
      const question = await appGet()
        .post('/questions')
        .send(fakeQuestion)
        .expect(201);

      const response = await appGet().get(`/questions/123`);

      expect(response.body.message).toBe('Internal server error');
      expect(response.status).toBe(500);
    });

    it('should return undefined', async () => {
      const fakeQuestion: CreateQuestionDto = {
        summary: faker.lorem.sentence() + '?',
        author: faker.name.firstName() + ' ' + faker.name.lastName(),
      };
      const question = await appGet()
        .post('/questions')
        .send(fakeQuestion)
        .expect(201);

      const response = await appGet().get(
        `/questions/${faker.datatype.uuid()}`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({});
    });
  });
});
