import { GroupMessageAttachment } from './group-message-attachment.entity';
import { MessageAttachment } from './message-attachment.entity';

export interface Attachment extends Express.Multer.File {}

export type UploadMessageAttachmentParams = {
  file: Attachment;
  messageAttachment: MessageAttachment;
};

export type UploadGroupMessageAttachmentParams = {
  file: Attachment;
  messageAttachment: GroupMessageAttachment;
};
