import { Optional } from '@nestjs/common';

export class UpdateUserDto {
  @Optional()
  firstname?: string;

  @Optional()
  lastname?: string;

  @Optional()
  password?: string;

  @Optional()
  avatar?: string;
}
