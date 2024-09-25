import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectRepository } from './project.repository';
import { ProjectDto } from './dto/progect.dto';
import { Project } from './project.entity';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectRepository)
    private projectRepository: ProjectRepository,
  ) {}

  async createProject(projectDto: ProjectDto): Promise<void> {
    await this.projectRepository.createProject(projectDto);
  }

  async deleteProject(id: string): Promise<void> {
    const result = await this.projectRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Project ${id} not found`);
    }
  }

  async getProjects(): Promise<Project[]> {
    const query = this.projectRepository.createQueryBuilder('project');
    const projects = await query.getMany();
    return projects;
  }

  async getProjectById(id: string): Promise<Project> {
    const found = this.projectRepository.findOneBy({ id: id });
    if (!found) {
      throw new NotFoundException(`Project ${id} not found`);
    }
    return found;
  }

  async updateProject(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const { title, description, teamLeader, members } = updateProjectDto;

    const project = await this.getProjectById(id);

    project.title = title;
    project.description = description;
    project.teamLeader = teamLeader;
    project.members = members;

    await this.projectRepository.save(project);
    return project;
  }
}
