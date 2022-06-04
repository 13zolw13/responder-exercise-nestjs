import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/questionDto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}
  getQuestions() {
    return this.questionRepository.find();
  }
  createQuestion(questionDto: CreateQuestionDto) {
    return this.questionRepository.save(questionDto);
  }
  async findQuestionById(id: string) {
    return await this.questionRepository.findOne(id);
  }
}
