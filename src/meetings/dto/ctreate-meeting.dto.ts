import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateMeetingDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsArray()
  members: string[];

  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  time: string;
}
