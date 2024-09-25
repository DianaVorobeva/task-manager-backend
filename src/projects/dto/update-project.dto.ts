import { Optional } from '@nestjs/common';

export class UpdateProjectDto {
  @Optional()
  title?: string;

  @Optional()
  description?: string;

  @Optional()
  teamLeader?: string;

  @Optional()
  members?: string[];
}
