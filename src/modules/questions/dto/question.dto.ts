import { IsString, IsUUID } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  summary: string;

  @IsString()
  author: string;

  @IsString()
  @IsUUID()
  userId: string;
}
