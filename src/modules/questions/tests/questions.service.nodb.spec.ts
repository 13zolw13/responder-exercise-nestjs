import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnswerDto } from '../dto/answerDto';
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

MockQuestions[0].answers = MockAnswers;
const MockAnswerDto: CreateAnswerDto = {
  summary: MockAnswers[0].summary,
  author: MockAnswers[0].author,
  questionId: MockQuestions[0].id,
};
describe('QuestionService without DB', () => {
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
            save: jest.fn().mockResolvedValue(MockAnswers[0]),
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
  describe('findQuestionById', () => {
    it('should return question with matching id ', () => {
      expect(service.findQuestionById(MockQuestions[0].id)).resolves.toEqual(
        MockQuestions[0],
      );
      expect(repositoryQuestion.findOne).toHaveBeenCalledTimes(1);
      expect(repositoryQuestion.findOne).toHaveBeenCalledWith(
        MockQuestions[0].id,
        { relations: ['answers'] },
      );
    });
  });
  describe('findQuestionsWithAnswers', () => {
    it('should return array of  answers under question', () => {
      expect(
        service.findQuestionsWithAnswers(MockQuestions[0].id),
      ).resolves.toEqual(MockQuestions[0].answers);
      expect(repositoryQuestion.findOne).toHaveBeenCalledTimes(1);
      expect(repositoryQuestion.findOne).toHaveBeenCalledWith(
        MockQuestions[0].id,
        { relations: ['answers'] },
      );
    });
  });
  describe('AddAnswer', () => {
    it('Should create answer ', () => {
      expect(service.addAnswer(MockAnswerDto)).resolves.toEqual(MockAnswers[0]);
      expect(repositoryAnswer.save).toHaveBeenCalledTimes(1);
      expect(repositoryAnswer.save).toHaveBeenCalledWith(MockAnswerDto);
    });
  });
  describe('findSpecificAnswer', () => {
    it('should return answer with matching id ', () => {
      expect(
        service.findSpecificAnswer(MockQuestions[0].id, MockAnswers[0].id),
      ).resolves.toEqual(MockAnswers[0]);
      expect(repositoryAnswer.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(repositoryAnswer.findOneOrFail).toHaveBeenCalledWith({
        id: MockAnswers[0].id,
        questionId: MockQuestions[0].id,
      });
    });
  });
});
