import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @IsNotEmpty()
  authorID: string;

  @IsString()
  @IsNotEmpty()
  recipientId: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
