import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateQuestionDto } from './dto/question.dto';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { mockQuestionDto, MockQuestions } from './tests/mockQuestionDto';
describe('QuestionsController', () => {
  let controller: QuestionsController;
  class QuestionsServiceMock {
    createQuestion(CreateQuestionDto: CreateQuestionDto) {
      return { id: faker.datatype.uuid(), ...CreateQuestionDto, answers: [] };
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

  it('should return array of questions ', () => {
    expect(controller.getQuestions()).toBeDefined();
    expect(controller.getQuestions()).toEqual([...MockQuestions]);
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
});
