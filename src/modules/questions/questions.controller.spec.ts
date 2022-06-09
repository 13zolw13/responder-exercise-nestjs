import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateQuestionDto } from './dto/question.dto';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { mockQuestionDto, MockQuestions } from './tests/mockQuestionDto';

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
});
