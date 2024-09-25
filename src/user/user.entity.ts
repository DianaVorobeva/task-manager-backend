/* eslint-disable @typescript-eslint/no-unused-vars */
import { Task } from 'src/tasks/task.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from 'src/projects/project.entity';
import { Role } from 'src/user/user-role.enum';
import { Group } from 'src/groups/group.entity';
import { Message } from 'src/messages/message.entity';
import { Meeting } from 'src/meetings/meetings.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  password: string;

  @Column({ default: './../../Public/defaultProfilePicture.png' })
  avatar: string;

  @Column('text', { array: true })
  roles: Role[];

  @OneToMany((_type) => Project, (project) => project.user, { eager: true })
  projects: Project[];

  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  @OneToMany(() => Message, (message) => message.author)
  @JoinColumn()
  messages: Message[];

  @ManyToMany(() => Group, (group) => group.users)
  groups: Group[];

  @ManyToMany(() => Meeting, (meeting) => meeting.users)
  meetings: Meeting[];
}
