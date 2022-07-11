import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import { CreateUserDto } from '../src/modules/users/dto/create-user.dto';
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
  describe('/login', () => {
    describe('(POST)', () => {
      it('should login, and return access token', async () => {
        const fakeUser: CreateUserDto = {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
        };
        await appGet().post('/users/signup').send(fakeUser).expect(201);
        const response = await appGet()
          .post('/login')
          .send({ username: fakeUser.username, password: fakeUser.password });
        expect(response.status).toBe(201);
        expect(response.body.access_token).toBeDefined();
      });
    });
  });
});
