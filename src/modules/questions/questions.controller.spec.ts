import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { MockQuestions } from './tests/mockQuestionDto';

describe('QuestionsController', () => {
  let controller: QuestionsController;
  class QuestionsServiceMock {
    createQuestion() {
      return {};
    }
    getQuestions() {
      return MockQuestions;
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
    expect(controller).toBeDefined();
  });

  it('should be defined', () => {
    expect(controller.getQuestions()).toBeDefined();
    console.log(controller.getQuestions());
    expect(controller.getQuestions()).toEqual([...MockQuestions]);
  });
});
