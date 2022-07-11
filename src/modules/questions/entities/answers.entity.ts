import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Question } from './question.entity';

@Entity({ name: 'answers' })
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @PrimaryColumn()
  questionId: string;

  @Column()
  summary: string;

  @Column()
  author: string;

  @Column()
  userId: string;
  @ManyToOne((type) => Question, (question) => question.answers)
  @JoinColumn()
  question: Question;

  @ManyToOne((type) => User, (user) => user.answers)
  @JoinColumn()
  user: User;
}
