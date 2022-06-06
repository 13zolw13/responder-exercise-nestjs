import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from '../dto/questionDto';
import { Answer } from '../entities/answers.entity';
import { Question } from '../entities/question.entity';
import { QuestionsService } from '../questions.service';

const mockQuestionDto: CreateQuestionDto = {
  summary: faker.lorem.sentence().replace('.', '?'),
  author: faker.name.firstName() + ' ' + faker.name.lastName(),
};
const MockQuestions: Question[] = [
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
const MockAnswers: Answer[] = [
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

describe('Question service without DB', () => {
  let service: QuestionsService;
  let repositoryQuestion: Repository<Question>;
  let repositoryAnswer: Repository<Answer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: getRepositoryToken(Question),
          useValue: {
            find: jest.fn().mockResolvedValue(MockQuestions),
            findOne: jest.fn().mockResolvedValue(MockQuestions[0]),
            save: jest.fn().mockResolvedValue(MockQuestions[0]),
            findOneOrFail: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: getRepositoryToken(Answer),
          useValue: {
            findOneOrFail: jest.fn().mockResolvedValue(MockAnswers[0]),
            save: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<QuestionsService>(QuestionsService);
    repositoryQuestion = module.get<Repository<Question>>(
      getRepositoryToken(Question),
    );
    repositoryAnswer = module.get<Repository<Answer>>(
      getRepositoryToken(Answer),
    );
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getQuestions', () => {
    it('should return of array of question', () => {
      expect(service.getQuestions()).resolves.toEqual(MockQuestions);
    });
  });
  describe('createQuestion', () => {
    it('should create new question ', () => {
      expect(service.createQuestion(mockQuestionDto)).resolves.toEqual(
        MockQuestions[0],
      );
      expect(repositoryQuestion.save).toHaveBeenCalledTimes(1);
    });
  });
});
