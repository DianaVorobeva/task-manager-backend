import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectDto } from './dto/progect.dto';
import { Project } from './project.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/user/user-role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { UpdateProjectDto } from './dto/update-project.dto';

@UseGuards(AuthGuard(), RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projectService: ProjectsService) {}

  @Get()
  getProjects(): Promise<Project[]> {
    return this.projectService.getProjects();
  }
  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Project> {
    return this.projectService.getProjectById(id);
  }
  @Post()
  @Roles(Role.ADMIN)
  createProject(@Body() projectDto: ProjectDto): Promise<void> {
    return this.projectService.createProject(projectDto);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN)
  deleteProject(@Param('id') id: string): Promise<void> {
    return this.projectService.deleteProject(id);
  }

  @Patch('/:id')
  @Roles(Role.ADMIN)
  updateProjectByAdmin(
    @Param('id') id: string,
    @Body() updateProjectDtoByAdmin: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectService.updateProject(id, updateProjectDtoByAdmin);
  }
}
