import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Answer } from './answers.entity';

@Entity({ name: 'questions' })
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  userId: string;
  @Column()
  summary: string;

  @Column({})
  author: string;

  @OneToMany((type) => Answer, (answer) => answer.question)
  @JoinTable()
  answers: Answer[];

  @ManyToOne((type) => User, (user) => user.questions)
  @JoinColumn()
  user: User;
}
