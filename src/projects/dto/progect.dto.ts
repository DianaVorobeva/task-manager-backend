import { IsArray, IsString } from 'class-validator';

export class ProjectDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  teamLeader: string;

  @IsArray()
  members: string[];
}
