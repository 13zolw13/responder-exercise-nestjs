import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/questionDto';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  getQuestions() {
    return this.questionsService.getQuestions();
  }

  @Post()
  createQuestion(@Body(new ValidationPipe()) questionDto: CreateQuestionDto) {
    return this.questionsService.createQuestion(questionDto);
  }

  @Get('/:questionId')
  async findQuestionById(@Param('questionId') questionId) {
    return await this.questionsService.findQuestionById(questionId);
  }
}
