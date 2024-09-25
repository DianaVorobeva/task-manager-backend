import { Optional } from '@nestjs/common';

export class UpdateMeetingDto {
  @Optional()
  title?: string;

  @Optional()
  members?: string[];

  @Optional()
  date?: string;

  @Optional()
  time?: string;
}
