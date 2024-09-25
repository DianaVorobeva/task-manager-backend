import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectDto } from './dto/progect.dto';

@Injectable()
export class ProjectRepository extends Repository<Project> {
  constructor(private dataSource: DataSource) {
    super(Project, dataSource.createEntityManager());
  }

  async createProject(projectDto: ProjectDto): Promise<void> {
    const { title, description, teamLeader, members } = projectDto;

    const project = this.create({ title, description, teamLeader, members });

    try {
      await this.save(project);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
