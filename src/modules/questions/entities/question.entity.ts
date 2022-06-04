import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'questions' })
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  summary: string;

  @Column({})
  author: string;

  //   @Column()
  //   answers: string[];
}
