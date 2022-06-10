import { IsEmail, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @Min(4)
  password: string;
}
