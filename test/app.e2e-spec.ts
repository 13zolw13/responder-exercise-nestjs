import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import { CreateAnswerDto } from '../src/modules/questions/dto/answer.dto';
import { CreateQuestionDto } from '../src/modules/questions/dto/question.dto';
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

  cleanupBeforeEachSpec();

  it('/ (GET)', () => {
    return appGet().get('/').expect(200).expect('Hello World!');
  });
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
  describe('/questions/:questionId', () => {
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

      const response = await appGet().get(
        `/questions/${faker.datatype.uuid() + 1}`,
      );

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

  describe('/questions/:questionId/answers', () => {
    describe('(POST)', () => {
      it('should add new answer', async () => {
        const fakeQuestion: CreateQuestionDto = {
          summary: faker.lorem.sentence() + '?',
          author: faker.name.firstName() + ' ' + faker.name.lastName(),
        };
        const question = await appGet()
          .post('/questions')
          .send(fakeQuestion)
          .expect(201);

        const fakeAnswer: CreateAnswerDto = {
          summary: faker.lorem.sentence(),
          author: faker.name.firstName() + ' ' + faker.name.lastName(),
          questionId: question.body.id,
        };
        const response = await appGet()
          .post(`/questions/${fakeAnswer.questionId}/answers`)
          .send(fakeAnswer)
          .expect(201);
      });
    });
    describe('(GET)', () => {
      it('should return empty table', async () => {
        const fakeQuestion: CreateQuestionDto = {
          summary: faker.lorem.sentence() + '?',
          author: faker.name.firstName() + ' ' + faker.name.lastName(),
        };
        const question = await appGet()
          .post('/questions')
          .send(fakeQuestion)
          .expect(201);
        const response = await appGet().get(
          `/questions/${question.body.id}/answers`,
        );
        expect(response.body).toEqual([]);
      });

      it('should return table', async () => {
        const fakeQuestion: CreateQuestionDto = {
          summary: faker.lorem.sentence() + '?',
          author: faker.name.firstName() + ' ' + faker.name.lastName(),
        };
        const question = await appGet()
          .post('/questions')
          .send(fakeQuestion)
          .expect(201);

        const fakeAnswer: CreateAnswerDto = {
          summary: faker.lorem.sentence(),
          author: faker.name.firstName() + ' ' + faker.name.lastName(),
          questionId: question.body.id,
        };
        const answer = await appGet()
          .post(`/questions/${fakeAnswer.questionId}/answers`)
          .send(fakeAnswer)
          .expect(201);

        const response = await appGet()
          .get(`/questions/${fakeAnswer.questionId}/answers`)
          .expect(200);
        expect(response.body).toEqual(
          expect.arrayContaining([expect.objectContaining(fakeAnswer)]),
        );
      });
    });
  });
  describe('/questions/:questionsId/answers/:answerId', () => {
    describe('(GET)', () => {
      it('should return answer', async () => {
        const fakeQuestion: CreateQuestionDto = {
          summary: faker.lorem.sentence() + '?',
          author: faker.name.firstName() + ' ' + faker.name.lastName(),
        };
        const question = await appGet()
          .post('/questions')
          .send(fakeQuestion)
          .expect(201);
        const fakeAnswer: CreateAnswerDto = {
          summary: faker.lorem.sentence(),
          author: faker.name.firstName() + ' ' + faker.name.lastName(),
          questionId: question.body.id,
        };
        const answer = await appGet()
          .post(`/questions/${fakeAnswer.questionId}/answers`)
          .send(fakeAnswer)
          .expect(201);
        const response = await appGet()
          .get(`/questions/${fakeAnswer.questionId}/answers/${answer.body.id}`)
          .expect(200);
        expect(response.body).toEqual(expect.objectContaining(fakeAnswer));
      });
      it('should return error ', async () => {
        const fakeQuestion: CreateQuestionDto = {
          summary: faker.lorem.sentence() + '?',
          author: faker.name.firstName() + ' ' + faker.name.lastName(),
        };
        const question = await appGet().post('/questions').send(fakeQuestion);
        const fakeAnswer: CreateAnswerDto = {
          summary: faker.lorem.sentence(),
          author: faker.name.firstName() + ' ' + faker.name.lastName(),
          questionId: question.body.id,
        };
        const answer = await appGet()
          .post(`/questions/${fakeAnswer.questionId}/answers`)
          .send(fakeAnswer)
          .expect(201);
        const fakeID = faker.datatype.uuid();
        const response = await appGet()
          .get(`/questions/${fakeAnswer.questionId}/answers/${fakeID}`)
          .expect(500);
        expect(response.body.message).toBe('Internal server error');
        expect(response.status).toBe(500);
      });
    });
  });
});
