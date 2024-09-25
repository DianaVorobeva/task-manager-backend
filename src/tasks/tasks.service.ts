import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/ctreate-task.dto';
import { GetTasksFilter } from './dto/get-task-fillter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import {
  UpdateTaskDtoByAdmin,
  UpdateTaskDtoByUser,
} from './dto/update-task.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  getTasks(filterDto: GetTasksFilter): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const found = this.taskRepository.findOneBy({ id: id });
    if (!found) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task ${id} not found`);
    }
  }

  async updateTaskByAdmin(
    id: string,
    updateTaskDtoByAdmin: UpdateTaskDtoByAdmin,
  ): Promise<Task> {
    const {
      title,
      description,
      dueDate,
      priory,
      progress,
      project,
      images,
      assignee,
      typeOfIssue,
      status,
    } = updateTaskDtoByAdmin;

    const task = await this.getTaskById(id);

    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    task.priority = priory;
    task.progress = progress;
    task.project = project;
    task.images = images;
    task.assignee = assignee;
    task.typeOfIssue = typeOfIssue;
    task.status = status;

    await this.taskRepository.save(task);
    return task;
  }

  async updateTaskByUser(
    id: string,
    updateTaskDtoByUser: UpdateTaskDtoByUser,
  ): Promise<Task> {
    const { progress, status } = updateTaskDtoByUser;
    const task = await this.getTaskById(id);

    task.progress = progress;
    task.status = status;

    await this.taskRepository.save(task);
    return task;
  }
}
