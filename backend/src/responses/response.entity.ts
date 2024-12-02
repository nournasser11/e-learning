import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Response {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  responseId: string;

  @Column()
  userId: string;

  @Column()
  quizId: string;

  @Column('json')
  answers: Record<string, any>[];

  @Column()
  score: number;

  @CreateDateColumn()
  submittedAt: Date;
  @Column()
  questionId: string;
}