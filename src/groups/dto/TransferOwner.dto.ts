import { IsNotEmpty, IsString } from 'class-validator';

export class TransferOwnerDto {
  @IsNotEmpty()
  @IsString()
  newOwnerId: string;
}
