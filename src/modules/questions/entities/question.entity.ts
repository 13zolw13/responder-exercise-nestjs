import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Answer } from './answers.entity';

@Entity({ name: 'questions' })
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  summary: string;

  @Column({})
  author: string;

  @OneToMany((type) => Answer, (answer) => answer.question)
  @JoinTable()
  answers: Answer[];
}
