import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../decorators/publicSIte.decorator';
import { JwtAuthGuard } from '../authentication/guards/authentication.jwt.guard';
import { CreateAnswerDto } from './dto/answer.dto';
import { CreateQuestionDto } from './dto/question.dto';
import { QuestionsService } from './questions.service';
@ApiTags('Questions')
@Public()
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}
  @UseGuards(JwtAuthGuard)
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

  @Get('/:questionId/answers/:answerId')
  async findAnswerByIds(
    @Param('questionId') questionId,
    @Param('answerId') answerId,
  ) {
    return await this.questionsService.findSpecificAnswer(questionId, answerId);
  }
}
