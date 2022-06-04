import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';

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

  it('/questions (GET)', async () => {
    return appGet().get('/questions').expect(200).expect([]);
  });
});
