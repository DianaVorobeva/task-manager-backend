/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskPriority, TaskProgress, TaskStatus, TaskType } from './task.enum';
import { IsEnum } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Project } from 'src/projects/project.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  assignee: string;

  @Column()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @Column('text', { array: true, nullable: true })
  images: string[];

  @Column()
  dueDate: string;

  @Column()
  project: string;

  @Column()
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @Column()
  @IsEnum(TaskProgress)
  progress: TaskProgress;

  @Column()
  @IsEnum(TaskType)
  typeOfIssue: TaskType;

  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;

  // @ManyToOne((_type) => Project, (project) => project.tasks, { eager: false })
  // @Exclude({ toPlainOnly: true })
  // project: Project;
}
