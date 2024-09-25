import { Attachment } from 'src/message-attachments/attachment.types';
import { User } from 'src/user/user.entity';
import { Message } from './message.entity';
import { Conversation } from 'src/conversations/consersations.intity';

export type CreateMessageParams = {
  id: string;
  content?: string;
  attachments?: Attachment[];
  user: User;
};

export type CreateMessageResponse = {
  message: Message;
  conversation: Conversation;
};

export type DeleteMessageParams = {
  userId: string;
  conversationId: string;
  messageId: string;
};

export type FindMessageParams = {
  userId: string;
  conversationId: string;
  messageId: string;
};

export type EditMessageParams = {
  conversationId: string;
  messageId: string;
  userId: string;
  content: string;
};

export const buildFindMessageParams = (params: FindMessageParams) => ({
  id: params.messageId,
  author: { id: params.userId },
  conversation: { id: params.conversationId },
});
