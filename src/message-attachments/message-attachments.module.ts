import { Module } from '@nestjs/common';
import { MessageAttachmentsService } from './message-attachments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageAttachment } from './message-attachment.entity';
import { GroupMessageAttachment } from './group-message-attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageAttachment, GroupMessageAttachment]),
  ],
  providers: [MessageAttachmentsService],
  exports: [MessageAttachmentsService],
})
export class MessageAttachmentsModule {}
