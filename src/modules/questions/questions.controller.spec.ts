import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateAnswerDto } from './dto/answer.dto';
import { CreateQuestionDto } from './dto/question.dto';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import {
  MockAnswerDto,
  mockQuestionDto,
  MockQuestions,
} from './tests/mockQuestionDto';

describe('QuestionsController', () => {
  let controller: QuestionsController;
  class QuestionsServiceMock {
    async createQuestion(createQuestionDto: CreateQuestionDto) {
      return {
        ...createQuestionDto,
        id: faker.datatype.uuid(),
      };
    }

    getQuestions() {
      return MockQuestions;
    }
    async findQuestionById(questionId: string) {
      return MockQuestions.find((question) => question.id === questionId);
    }
    async addAnswer(createAnswerDto: CreateAnswerDto) {
      return {
        ...createAnswerDto,
        id: faker.datatype.uuid(),
      };
    }
    async findQuestionsWithAnswers(questionId: string) {
      return MockQuestions.find((question) => question.id === questionId)
        .answers;
    }
    async findSpecificAnswer(questionId: string, answerId: string) {
      return MockQuestions.find(
        (question) => question.id === questionId,
      ).answers.find((answer) => answer.id === answerId);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [QuestionsService],
    })
      .overrideProvider(QuestionsService)
      .useClass(QuestionsServiceMock)
      .compile();

    controller = module.get<QuestionsController>(QuestionsController);
  });

  it('should be defined', () => {
    expect(QuestionsController).toBeDefined();
  });

  it('should return array of questions ', () => {
    expect(controller.getQuestions()).toEqual(MockQuestions);
  });
  it('should return created question ', async () => {
    const question = await controller.createQuestion(mockQuestionDto);
    expect(question).toBeDefined();
    expect(question).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ...mockQuestionDto,
      }),
    );
  });
  it('should return question with matching id ', async () => {
    const question = await controller.findQuestionById(MockQuestions[0].id);
    expect(question).toBeDefined();
    expect(question).toEqual(MockQuestions[0]);
  });
  it('should return created answer ', async () => {
    const answer = await controller.AddAnswers(MockAnswerDto);
    expect(answer).toBeDefined();
    expect(answer).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ...MockAnswerDto,
      }),
    );
  });
  it('should return array of answers ', async () => {
    const answers = await controller.findQuestionsWithAnswers(
      MockQuestions[0].id,
    );
    expect(answers).toBeDefined();
    expect(answers).toEqual(MockQuestions[0].answers);
  });

  it('should return specific answer ', async () => {
    const answer = await controller.findAnswerByIds(
      MockQuestions[0].id,
      MockQuestions[0].answers[0].id,
    );
    expect(answer).toBeDefined();
    expect(answer).toEqual(MockQuestions[0].answers[0]);
  });
});
