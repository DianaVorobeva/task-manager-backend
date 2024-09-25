import { TaskPriority, TaskProgress, TaskStatus, TaskType } from '../task.enum';
import { Optional } from '@nestjs/common';

export class UpdateTaskDtoByAdmin {
  @Optional()
  title?: string;

  @Optional()
  description?: string;

  @Optional()
  assignee?: string;

  @Optional()
  images?: string[];

  @Optional()
  dueDate?: string;

  @Optional()
  project?: string;

  @Optional()
  status?: TaskStatus;

  @Optional()
  priory?: TaskPriority;

  @Optional()
  progress?: TaskProgress;

  @Optional()
  typeOfIssue?: TaskType;
}

export class UpdateTaskDtoByUser {
  @Optional()
  status?: TaskStatus;

  @Optional()
  progress?: TaskProgress;
}
