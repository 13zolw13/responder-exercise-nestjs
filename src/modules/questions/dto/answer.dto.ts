import { IsString, IsUUID } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  summary: string;
  @IsString()
  author: string;
  @IsUUID()
  questionId: string;
}
