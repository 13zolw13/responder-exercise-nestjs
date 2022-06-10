<<<<<<< HEAD
import { Entity } from 'typeorm';

@Entity({ name: 'users' })
export class User {}
=======
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
>>>>>>> feat: add user entity
