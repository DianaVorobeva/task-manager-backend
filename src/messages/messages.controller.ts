import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IMessageService } from './message';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { User } from 'src/user/user.entity';
import { Attachment } from 'src/message-attachments/attachment.types';
import { EmptyMessageException } from './exceptions/EmptyMessage';
import { EditMessageDto } from './dto/EditMessage.dto';
import { CreateMessageDto } from './dto/CreateMessage.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { MessageService } from './messages.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('messages')
@UseGuards(AuthGuard())
export class MessageController {
  constructor(
    @Inject() private readonly messageService: MessageService,
    // private eventEmitter: EventEmitter2,
  ) {}

  @Throttle({ default: { limit: 10, ttl: 10 } })
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'attachments',
        maxCount: 5,
      },
    ]),
  )
  @Post()
  async createMessage(
    @GetUser() user: User,
    @UploadedFiles() attachments: Attachment[],
    @Body('id') id: string,
    @Body('content') content: string,
  ) {
    if (!attachments && !content) throw new EmptyMessageException();
    console.log(user);
    const response = await this.messageService.createMessage(
      user,
      id,
      content,
      attachments,
    );
    // this.eventEmitter.emit('message.create', response);
    return;
  }

  @Get()
  @SkipThrottle()
  async getMessagesFromConversation(
    @GetUser() user: User,
    @Param('id') id: string,
  ) {
    const messages = await this.messageService.getMessages(id);
    return { id, messages };
  }

  @Delete(':messageId')
  async deleteMessageFromConversation(
    @GetUser() user: User,
    @Param('id') conversationId: string,
    @Param('messageId') messageId: string,
  ) {
    const params = { userId: user.id, conversationId, messageId };
    await this.messageService.deleteMessage(params);
    // this.eventEmitter.emit('message.delete', params);
    return { conversationId, messageId };
  }
  // api/conversations/:conversationId/messages/:messageId
  @Patch(':messageId')
  async editMessage(
    @GetUser() { id: userId }: User,
    @Param('id') conversationId: string,
    @Param('messageId') messageId: string,
    @Body() { content }: EditMessageDto,
  ) {
    const params = { userId, content, conversationId, messageId };
    const message = await this.messageService.editMessage(params);
    // this.eventEmitter.emit('message.update', message);
    return message;
  }
}
