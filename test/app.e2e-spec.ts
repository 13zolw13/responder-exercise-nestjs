import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import { JwtStrategy } from '../src/modules/authentication/strategies/authentication.jwt.strategy';
import { JwtStrategyMock } from '../src/modules/authentication/strategies/mock.jwt.strategy';
import { CreateAnswerDto } from '../src/modules/questions/dto/answer.dto';
import { CreateQuestionDto } from '../src/modules/questions/dto/question.dto';
import { CreateUserDto } from '../src/modules/users/dto/create-user.dto';
import { cleanupBeforeEachSpec } from '../src/utils/dbCleaner';

describe('e2e with mock jwt', () => {
  let app: INestApplication;
  const appGet = () => request(app.getHttpServer());
  let question: request.Response;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtStrategy)
      .useClass(JwtStrategyMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  cleanupBeforeEachSpec();

  const fakeQuestion: CreateQuestionDto = {
    summary: faker.lorem.sentence() + '?',
    author: faker.name.firstName() + ' ' + faker.name.lastName(),
  };

  async function stabQuestion() {
    return await appGet().post('/questions').send(fakeQuestion).expect(201);
  }
  beforeEach(async () => {
    question = await stabQuestion();
  });
  describe('Public', () => {
    describe('/questions', () => {
      describe('POST', () => {
        it('should add new question', async () => {
          await appGet().post('/questions').send(fakeQuestion).expect(201);
        });
      });
      describe('(GET)', () => {
        it('should return array of questions', async () => {
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
          const questionId = question.body.id;
          const response = await appGet()
            .get(`/questions/${questionId}`)
            .expect(200);
          expect(response.body).toEqual(expect.objectContaining(fakeQuestion));
        });

        it('should throw error-wrong id', async () => {
          const response = await appGet().get(
            `/questions/${faker.datatype.uuid() + 1}`,
          );

          expect(response.body.message).toBe('Internal server error');
          expect(response.status).toBe(500);
        });

        it('should return undefined', async () => {
          const response = await appGet().get(
            `/questions/${faker.datatype.uuid()}`,
          );
          expect(response.status).toBe(200);
          expect(response.body).toStrictEqual({});
        });
      });
    });

    describe('/questions/:questionId/answers', () => {
      describe('(POST)', () => {
        it('should add new answer', async () => {
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
          const response = await appGet().get(
            `/questions/${question.body.id}/answers`,
          );
          expect(response.body).toEqual([]);
        });

        it('should return table', async () => {
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
            .get(
              `/questions/${fakeAnswer.questionId}/answers/${answer.body.id}`,
            )
            .expect(200);
          expect(response.body).toEqual(expect.objectContaining(fakeAnswer));
        });
        it('should return error ', async () => {
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
    describe('/users/signup', () => {
      describe('(POST)', () => {
        it('should create new user', async () => {
          const fakeUser: CreateUserDto = {
            username: faker.internet.userName(),
            password: faker.internet.password(),
            email: faker.internet.email(),
          };
          const response = await stabMockUser(appGet, fakeUser);
          expect(response.status).toBe(201);
        });
      });
    });
  });
  describe.only('Private', () => {
    let userResponse: request.Response;
    const userId = faker.datatype.uuid();
    const username = faker.name.firstName();
    const fakeUser: CreateUserDto = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
    };

    beforeEach(async () => {
      userResponse = await stabMockUser(appGet, fakeUser);
      return userResponse;
    });
    describe('/users', () => {
      describe('(GET)', () => {
        it('should return unauthorized', async () => {
          const response = await appGet().get('/users');
          expect(response.status).toBe(401);
          expect(response.body.message).toBe('Unauthorized');
        });
        it('should return users', async () => {
          const response = await asAuthorizedUser(
            appGet().get('/users'),
            userId,
            username,
          );
          expect(response.status).toBe(200);
          expect(response.body).toEqual(expect.arrayContaining([]));
        });
      });
    });
    describe('/users/:userId', () => {
      describe('(GET)', () => {
        it('should return user', async () => {
          const response = await asAuthorizedUser(
            appGet().get(`/users/${userResponse.body.id}`),
            userId,
            username,
          );
          expect(response.status).toBe(200);
          expect(response.body).toEqual(expect.objectContaining({}));
        });
        it('should return error wrong uuid', async () => {
          const response = await asAuthorizedUser(
            appGet().get(`/users/${userResponse.body.id + 1}`),
            userId,
            username,
          );
          expect(response.status).toBe(500);
          expect(response.body).toEqual(expect.objectContaining({}));
        });
        it('should return user', async () => {
          const response = await asAuthorizedUser(
            appGet().get(`/users/${faker.datatype.uuid()}`),
            userId,
            username,
          );
          expect(response.status).toBe(500);
          expect(response.body).toEqual(expect.objectContaining({}));
        });
      });
    });
  });
  afterAll(async () => {
    await app.close();
  });
});

const createToken = (userId: string, username: string) => {
  return jwt.sign(
    {
      sub: userId,
      username: username,
    },
    JwtStrategyMock.SECRET_MOCK,
  );
};

async function stabMockUser(
  appGet: () => request.SuperTest<request.Test>,
  createUserDto: CreateUserDto,
) {
  const user = new CreateUserDto();
  user.username = createUserDto.username;
  user.password = createUserDto.password;
  user.email = createUserDto.email;

  return await appGet().post('/users/signup').send(user).expect(201);
}

function asAuthorizedUser(fn: request.Test, userId: string, username: string) {
  return fn.set({ Authorization: `Bearer ${createToken(userId, username)}` });
}
