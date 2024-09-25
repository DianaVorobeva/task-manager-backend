/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { IMessageService } from './message';
import { Repository } from 'typeorm';
import {
  buildFindMessageParams,
  CreateMessageParams,
  DeleteMessageParams,
  EditMessageParams,
} from './message.types';
import { Conversation } from 'src/conversations/consersations.intity';
import { CannotDeleteMessage } from './exceptions/CannotDeleteMessage';
import { ConversationNotFoundException } from 'src/conversations/exceptions/ConversationNotFound';
import { CannotCreateMessageException } from './exceptions/CannotCreateMessage';
import { instanceToPlain } from 'class-transformer';
import { ConversationsService } from 'src/conversations/conversations.service';
import { MessageAttachmentsService } from 'src/message-attachments/message-attachments.service';
import { User } from 'src/user/user.entity';
import { Attachment } from 'src/message-attachments/attachment.types';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject()
    private readonly conversationService: ConversationsService,
    @Inject()
    private readonly messageAttachmentsService: MessageAttachmentsService,
  ) {}

  async createMessage(
    user: User,
    id: string,
    content: string,
    attachments: Attachment[],
  ) {
    const conversation = await this.conversationService.findById(id);
    if (!conversation) throw new ConversationNotFoundException();
    const { creator, recipient } = conversation;
    // if (creator.id !== user.id && recipient.id !== user.id)
    //   throw new CannotCreateMessageException();
    const message = this.messageRepository.create({
      content,
      conversation,
      author: instanceToPlain(user),
      attachments: attachments
        ? await this.messageAttachmentsService.create(attachments)
        : [],
    });
    const savedMessage = await this.messageRepository.save(message);
    conversation.lastMessageSent = savedMessage;
    const updated = await this.conversationService.save(conversation);
    return { message: savedMessage, conversation: updated };
  }

  getMessages(conversationId: string): Promise<Message[]> {
    return this.messageRepository.find({
      relations: ['author', 'attachments'],
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteMessage(params: DeleteMessageParams) {
    const { conversationId, messageId } = params;
    const msgParams = { id: conversationId, limit: 5 };
    const conversation =
      await this.conversationService.findById(conversationId);
    if (!conversation) throw new ConversationNotFoundException();
    const _findMessageParams = buildFindMessageParams(params);
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
    });
    if (!message) throw new CannotDeleteMessage();
    if (conversation.lastMessageSent.id !== message.id)
      return this.messageRepository.delete({ id: message.id });
    return this.deleteLastMessage(conversation, message);
  }

  async deleteLastMessage(conversation: Conversation, message: Message) {
    const size = conversation.messages.length;
    const SECOND_MESSAGE_INDEX = 1;
    if (size <= 1) {
      console.log('Last Message Sent is deleted');
      await this.conversationService.update({
        id: conversation.id,
        lastMessageSent: null,
      });
      return this.messageRepository.delete({ id: message.id });
    } else {
      console.log('There are more than 1 message');
      const newLastMessage = conversation.messages[SECOND_MESSAGE_INDEX];
      await this.conversationService.update({
        id: conversation.id,
        lastMessageSent: newLastMessage,
      });
      return this.messageRepository.delete({ id: message.id });
    }
  }

  async editMessage(params: EditMessageParams) {
    const messageDB = await this.messageRepository.findOne({
      where: {
        id: params.messageId,
        author: { id: params.userId },
      },
      relations: [
        'conversation',
        'conversation.creator',
        'conversation.recipient',
        'author',
      ],
    });
    if (!messageDB)
      throw new HttpException('Cannot Edit Message', HttpStatus.BAD_REQUEST);
    messageDB.content = params.content;
    return this.messageRepository.save(messageDB);
  }
}
