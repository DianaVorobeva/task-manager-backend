/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Task } from 'src/tasks/task.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  teamLeader: string;

  @Column('text', { array: true })
  members: string[];

  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;

  // @OneToMany((_type) => Task, (task) => task.project, { eager: false })
  // @Exclude({ toPlainOnly: true })
  // tasks: Task[];
}
