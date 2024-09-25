import { Message } from 'src/messages/message.entity';

export type CreateConversationParams = {
  recipientId: string;
  message: string;
};

export type ConversationIdentityType = 'author' | 'recipient';

export type GetConversationMessagesParams = {
  id: string;
  limit: number;
};

export type UpdateConversationParams = Partial<{
  id: string;
  lastMessageSent: Message;
}>;

export type AccessParams = {
  id: string;
  userId: string;
};
