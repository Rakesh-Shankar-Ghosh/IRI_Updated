// src/entities/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  country: string;

  @Column()
  profession: string;


}
