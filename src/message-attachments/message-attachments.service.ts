/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { IMessageAttachmentsService } from './message-attachment';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageAttachment } from './message-attachment.entity';
import { Repository } from 'typeorm';
import { GroupMessageAttachment } from './group-message-attachment.entity';
import { Attachment } from './attachment.types';

@Injectable()
export class MessageAttachmentsService implements IMessageAttachmentsService {
  constructor(
    @InjectRepository(MessageAttachment)
    private readonly attachmentRepository: Repository<MessageAttachment>,
    @InjectRepository(GroupMessageAttachment)
    private readonly groupAttachmentRepository: Repository<GroupMessageAttachment>,
  ) {}

  create(attachments: Attachment[]) {
    const promise = attachments.map((attachment) => {
      const newAttachment = this.attachmentRepository.create();
      return this.attachmentRepository.save(newAttachment);
    });
    return Promise.all(promise);
  }

  createGroupAttachments(
    attachments: Attachment[],
  ): Promise<GroupMessageAttachment[]> {
    const promise = attachments.map((attachment) => {
      const newAttachment = this.groupAttachmentRepository.create();
      return this.groupAttachmentRepository.save(newAttachment);
    });
    return Promise.all(promise);
  }

  deleteAllAttachments(attachments: MessageAttachment[]) {
    const promise = attachments.map((attachment) =>
      this.attachmentRepository.delete(attachment.key),
    );
    return Promise.all(promise);
  }
}
