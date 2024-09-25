import { Optional } from '@nestjs/common';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskType } from '../task.enum';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  assignee: string;

  @IsNotEmpty()
  project: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  dueDate: string;

  @Optional()
  images?: string[];

  @IsNotEmpty()
  @IsEnum(TaskType)
  typeOfIssue: TaskType;
}
