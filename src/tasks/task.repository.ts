import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/ctreate-task.dto';
import { TaskPriority, TaskProgress, TaskStatus } from './task.enum';
import { GetTasksFilter } from './dto/get-task-fillter.dto';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTasksFilter): Promise<Task[]> {
    const { search, status } = filterDto;
    const query = this.createQueryBuilder('task');
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search) OR LOWER(task.assignee) LIKE LOWER(:search))',
        {
          search: `%${search}%`,
        },
      );
    }
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    const tasks = await query.getMany();
    return tasks;
  }
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const {
      title,
      description,
      dueDate,
      project,
      assignee,
      typeOfIssue,
      images,
    } = createTaskDto;
    const task = this.create({
      title,
      description,
      dueDate,
      project,
      assignee,
      images: images,
      status: TaskStatus.OPEN,
      progress: TaskProgress.Zero,
      priority: TaskPriority.One,
      typeOfIssue: typeOfIssue,
      user,
    });

    await this.save(task);
    return task;
  }
}
