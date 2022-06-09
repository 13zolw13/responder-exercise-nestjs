import { IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  summary: string;

  @IsString()
  author: string;
}
