import { User } from 'src/user/user.entity';
import { Message } from './message.entity';
import {
  CreateMessageParams,
  CreateMessageResponse,
  DeleteMessageParams,
  EditMessageParams,
} from './message.types';
import { Attachment } from 'src/message-attachments/attachment.types';

export interface IMessageService {
  createMessage(
    user: User,
    id: string,
    content: string,
    attachments: Attachment[],
  ): Promise<CreateMessageResponse>;
  getMessages(id: string): Promise<Message[]>;
  deleteMessage(params: DeleteMessageParams);
  editMessage(params: EditMessageParams): Promise<Message>;
}
