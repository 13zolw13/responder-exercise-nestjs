import * as argon2 from 'argon2';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Answer } from '../../questions/entities/answers.entity';
import { Question } from '../../questions/entities/question.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Question, (question) => question.user)
  @JoinTable()
  questions: Question[];

  @OneToMany(() => Answer, (answer) => answer.user)
  @JoinTable()
  answers: Answer[];
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    try {
      const hash = await argon2.hash(this.password);
      this.password = hash;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
