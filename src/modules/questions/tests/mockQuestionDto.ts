import { faker } from '@faker-js/faker';
import { User } from '../../users/entities/user.entity';
import { CreateAnswerDto } from '../dto/answer.dto';
import { CreateQuestionDto } from '../dto/question.dto';
import { Answer } from '../entities/answers.entity';
import { Question } from '../entities/question.entity';

export const mockQuestionDto: CreateQuestionDto = {
  summary: faker.lorem.sentence().replace('.', '?'),
  author: faker.name.firstName() + ' ' + faker.name.lastName(),
  userId: faker.datatype.uuid(),
};
const mockUserNew = new User();
mockUserNew.id = faker.datatype.uuid();
mockUserNew.username = faker.name.firstName() + ' ' + faker.name.lastName();
mockUserNew.email = faker.internet.email();
mockUserNew.password = faker.internet.password();
mockUserNew.questions = [];

export const MockQuestions: Question[] = [
  {
    id: faker.datatype.uuid(),
    summary: mockQuestionDto.summary,
    author: mockQuestionDto.author,
    answers: [],
    user: mockUserNew,
    userId: mockUserNew.id,
  },
  {
    id: faker.datatype.uuid(),
    summary: faker.lorem.sentence().replace('.', '?'),
    author: faker.name.firstName(),
    answers: [],
    user: mockUserNew,
    userId: mockUserNew.id,
  },
  {
    id: faker.datatype.uuid(),
    summary: faker.lorem.sentence().replace('.', '?'),
    author: faker.name.firstName(),
    answers: [],
    user: mockUserNew,
    userId: mockUserNew.id,
  },
  {
    id: faker.datatype.uuid(),
    summary: faker.lorem.sentence().replace('.', '?'),
    author: faker.name.firstName(),
    answers: [],
    user: mockUserNew,
    userId: mockUserNew.id,
  },
];
export const MockAnswers: Answer[] = [
  {
    id: faker.datatype.uuid(),
    summary: faker.lorem.sentence(),
    author: faker.name.firstName(),
    questionId: MockQuestions[0].id,
    question: MockQuestions[0],
    user: mockUserNew,
    userId: mockUserNew.id,
  },
  {
    id: faker.datatype.uuid(),
    summary: faker.lorem.sentence(),
    author: faker.name.firstName(),
    questionId: MockQuestions[0].id,
    question: MockQuestions[0],
    user: mockUserNew,
    userId: mockUserNew.id,
  },
  {
    id: faker.datatype.uuid(),
    summary: faker.lorem.sentence(),
    author: faker.name.firstName(),
    questionId: MockQuestions[0].id,
    question: MockQuestions[0],
    user: mockUserNew,
    userId: mockUserNew.id,
  },
  {
    id: faker.datatype.uuid(),
    summary: faker.lorem.sentence(),
    author: faker.name.firstName(),
    questionId: MockQuestions[0].id,
    question: MockQuestions[0],
    user: mockUserNew,
    userId: mockUserNew.id,
  },
];
MockQuestions[0].answers = MockAnswers;
export const MockAnswerDto: CreateAnswerDto = {
  summary: MockAnswers[0].summary,
  author: MockAnswers[0].author,
  questionId: MockQuestions[0].id,
};
