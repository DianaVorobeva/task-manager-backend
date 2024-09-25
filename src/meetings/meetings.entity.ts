import { Exclude } from 'class-transformer';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  creatorId: string;

  @OneToMany(() => User, (user) => user.meetings)
  @Exclude({ toPlainOnly: true })
  users: User[];
  @JoinTable()
  @Column('text', { array: true })
  members: string[];

  @Column()
  date: string;

  @Column()
  time: string;
}
