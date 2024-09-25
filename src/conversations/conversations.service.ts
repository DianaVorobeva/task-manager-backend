import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IConversationsService } from './conversations';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Conversation } from './consersations.intity';
import { User } from 'src/user/user.entity';
import {
  AccessParams,
  CreateConversationParams,
  GetConversationMessagesParams,
  UpdateConversationParams,
} from './conversations.types';
import { ConversationNotFoundException } from './exceptions/ConversationNotFound';
import { CreateConversationException } from './exceptions/CreateConversation';
import { Repository } from 'typeorm';
import { Message } from 'src/messages/message.entity';

@Injectable()
export class ConversationsService implements IConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject()
    private readonly userService: UserService,
  ) {}
  async getConversations(id: string): Promise<Conversation[]> {
    return (
      this.conversationsRepository
        .createQueryBuilder('conversation')
        .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
        .leftJoinAndSelect('conversation.creator', 'creator')
        .leftJoinAndSelect('conversation.recipient', 'recipient')
        // .leftJoinAndSelect('creator.peer', 'creatorPeer')
        // .leftJoinAndSelect('recipient.peer', 'recipientPeer')
        // .leftJoinAndSelect('creator.profile', 'creatorProfile')
        // .leftJoinAndSelect('recipient.profile', 'recipientProfile')
        .where('creator.id = :id', { id })
        .orWhere('recipient.id = :id', { id })
        .orderBy('conversation.lastMessageSentAt', 'DESC')
        .getMany()
    );
  }

  async findById(id: string) {
    return this.conversationsRepository.findOne({
      where: { id },
      relations: ['creator', 'recipient', 'lastMessageSent'],
    });
  }

  async isCreated(userId: string, recipientId: string) {
    return this.conversationsRepository.findOne({
      where: [
        {
          creator: { id: userId },
          recipient: { id: recipientId },
        },
        {
          creator: { id: recipientId },
          recipient: { id: userId },
        },
      ],
    });
  }

  async createConversation(creator: User, params: CreateConversationParams) {
    const { recipientId, message: content } = params;
    const recipient = await this.userService.getUserById(recipientId);
    if (!recipient) throw new NotFoundException();
    if (creator.id === recipient.id)
      throw new CreateConversationException(
        'Cannot create Conversation with yourself',
      );

    const newConversation = this.conversationsRepository.create({
      creator,
      recipient,
    });
    const conversation =
      await this.conversationsRepository.save(newConversation);
    const newMessage = this.messageRepository.create({
      content,
      conversation,
      author: creator,
    });
    await this.messageRepository.save(newMessage);
    return conversation;
  }

  async hasAccess({ id, userId }: AccessParams) {
    const conversation = await this.findById(id);
    if (!conversation) throw new ConversationNotFoundException();
    return (
      conversation.creator.id === userId || conversation.recipient.id === userId
    );
  }

  save(conversation: Conversation): Promise<Conversation> {
    return this.conversationsRepository.save(conversation);
  }

  getMessages({
    id,
    limit,
  }: GetConversationMessagesParams): Promise<Conversation> {
    return this.conversationsRepository
      .createQueryBuilder('conversation')
      .where('id = :id', { id })
      .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('conversation.messages', 'message')
      .where('conversation.id = :id', { id })
      .orderBy('message.createdAt', 'DESC')
      .limit(limit)
      .getOne();
  }

  update({ id, lastMessageSent }: UpdateConversationParams) {
    return this.conversationsRepository.update(id, { lastMessageSent });
  }
}
