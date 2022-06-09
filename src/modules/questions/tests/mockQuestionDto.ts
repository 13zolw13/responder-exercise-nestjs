import { faker } from '@faker-js/faker';
import { CreateAnswerDto } from '../dto/answer.dto';
import { CreateQuestionDto } from '../dto/question.dto';
import { Answer } from '../entities/answers.entity';
import { Question } from '../entities/question.entity';

export const mockQuestionDto: CreateQuestionDto = {
  summary: faker.lorem.sentence().replace('.', '?'),
  author: faker.name.firstName() + ' ' + faker.name.lastName(),
};
export const MockQuestions: Question[] = [
  {
    id: faker.datatype.uuid(),
    summary: mockQuestionDto.summary,
    author: mockQuestionDto.author,
    answers: [],
  },
  {
    id: faker.datatype.uuid(),
    summary: faker.lorem.sentence().replace('.', '?'),
    author: faker.name.firstName(),
    answers: [],
  },
  {
    id: faker.datatype.uuid(),
    summary: faker.lorem.sentence().replace('.', '?'),
    author: faker.name.firstName(),
    answers: [],
  },
  {
    id: faker.datatype.uuid(),
    summary: faker.lorem.sentence().replace('.', '?'),
    author: faker.name.firstName(),
    answers: [],
  },
];
export const MockAnswers: Answer[] = [
  {
    id: faker.datatype.uuid(),
    summary: faker.lorem.sentence(),
    author: faker.name.firstName(),
    questionId: MockQuestions[0].id,
    question: MockQuestions[0],
  },
  {
    id: faker.datatype.uuid(),
    summary: faker.lorem.sentence(),
    author: faker.name.firstName(),
    questionId: MockQuestions[0].id,
    question: MockQuestions[0],
  },
  {
    id: faker.datatype.uuid(),
    summary: faker.lorem.sentence(),
    author: faker.name.firstName(),
    questionId: MockQuestions[0].id,
    question: MockQuestions[0],
  },
  {
    id: faker.datatype.uuid(),
    summary: faker.lorem.sentence(),
    author: faker.name.firstName(),
    questionId: MockQuestions[0].id,
    question: MockQuestions[0],
  },
];
MockQuestions[0].answers = MockAnswers;
export const MockAnswerDto: CreateAnswerDto = {
  summary: MockAnswers[0].summary,
  author: MockAnswers[0].author,
  questionId: MockQuestions[0].id,
};
