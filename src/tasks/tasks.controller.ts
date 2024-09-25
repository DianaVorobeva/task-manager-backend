import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/ctreate-task.dto';
import { GetTasksFilter } from './dto/get-task-fillter.dto';
import {
  UpdateTaskDtoByAdmin,
  UpdateTaskDtoByUser,
} from './dto/update-task.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/user.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/user-role.enum';
import { Roles } from 'src/auth/roles.decorator';

@Controller('tasks')
@UseGuards(AuthGuard(), RolesGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilter): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN)
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  @Patch('/:id/updateByAdmin')
  @Roles(Role.ADMIN)
  updateTaskByAdmin(
    @Param('id') id: string,
    @Body() updateTaskDtoByAdmin: UpdateTaskDtoByAdmin,
  ): Promise<Task> {
    return this.tasksService.updateTaskByAdmin(id, updateTaskDtoByAdmin);
  }

  @Patch('/:id/updateByUser')
  updateTaskByUser(
    @Param('id') id: string,
    @Body() updateTaskDtoByUser: UpdateTaskDtoByUser,
  ): Promise<Task> {
    return this.tasksService.updateTaskByUser(id, updateTaskDtoByUser);
  }
}
