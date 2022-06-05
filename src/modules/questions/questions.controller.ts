import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateAnswerDto } from './dto/answerDto';
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

  @Get('/:questionId/answers')
  async findQuestionsWithAnswers(@Param('questionId') questionId) {
    return await this.questionsService.findQuestionsWithAnswers(questionId);
  }

  @Post('/:questionId/answers')
  async AddAnswers(
    @Body(new ValidationPipe()) createAnswerDto: CreateAnswerDto,
  ) {
    return await this.questionsService.addAnswer(createAnswerDto);
  }
}
