import { faker } from '@faker-js/faker';
import { CreateAnswerDto } from './dto/answer.dto';
import { CreateQuestionDto } from './dto/question.dto';
import { MockQuestions } from './tests/mockQuestionDto';

export class QuestionsServiceMock {
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
    return MockQuestions.find((question) => question.id === questionId).answers;
  }
  async findSpecificAnswer(questionId: string, answerId: string) {
    return MockQuestions.find(
      (question) => question.id === questionId,
    ).answers.find((answer) => answer.id === answerId);
  }
}
