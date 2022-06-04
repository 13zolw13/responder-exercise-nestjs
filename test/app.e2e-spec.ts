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
    });
  });
});
