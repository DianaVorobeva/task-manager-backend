import { Attachment } from './attachment.types';
import { GroupMessageAttachment } from './group-message-attachment.entity';
import { MessageAttachment } from './message-attachment.entity';

export interface IMessageAttachmentsService {
  create(attachments: Attachment[]): Promise<MessageAttachment[]>;
  createGroupAttachments(
    attachments: Attachment[],
  ): Promise<GroupMessageAttachment[]>;
  deleteAllAttachments(attachments: MessageAttachment[]);
}
