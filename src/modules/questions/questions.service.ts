import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnswerDto } from './dto/answerDto';
import { CreateQuestionDto } from './dto/questionDto';
import { Answer } from './entities/answers.entity';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}

  getQuestions() {
    return this.questionRepository.find({ relations: ['answers'] });
  }
  createQuestion(questionDto: CreateQuestionDto) {
    return this.questionRepository.save(questionDto);
  }
  async findQuestionById(id: string) {
    return await this.questionRepository.findOne(id, {
      relations: ['answers'],
    });
  }

  async addAnswer(createAnswerDto: CreateAnswerDto) {
    const answer = await this.answerRepository.save({ ...createAnswerDto });
    return answer;
  }
  async findQuestionsWithAnswers(id: string) {
    const question = await this.questionRepository.findOne(id, {
      relations: ['answers'],
    });
    return question.answers;
  }

  async findSpecificAnswer(questionId: string, answerId: string) {
    const answer = await this.answerRepository.findOneOrFail({
      id: answerId,
      questionId,
    });
    return answer;
  }
}
