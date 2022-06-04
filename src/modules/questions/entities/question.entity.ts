import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Question')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  summary: string;

  @Column()
  author: string;

  //   @Column()
  //   answers: string[];
}
