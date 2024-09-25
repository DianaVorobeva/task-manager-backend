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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { GetUser } from 'src/auth/get-user.decorator';
import { Attachment } from 'src/message-attachments/attachment.types';
import { CreateMessageDto } from 'src/messages/dto/CreateMessage.dto';
import { EditMessageDto } from 'src/messages/dto/EditMessage.dto';
import { EmptyMessageException } from 'src/messages/exceptions/EmptyMessage';
import { User } from 'src/user/user.entity';
import { GroupMessageService } from '../services/group-messages.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('groupMessage')
@UseGuards(AuthGuard())
export class GroupMessageController {
  constructor(
    @Inject()
    private readonly groupMessageService: GroupMessageService,
    // private readonly eventEmitter: EventEmitter2,
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
  async createGroupMessage(
    @GetUser() user: User,
    @UploadedFiles() attachments: Attachment[],
    @Param('id') id: string,
    @Body() { content }: CreateMessageDto,
  ) {
    console.log(`Creating Group Message for ${id}`);
    if (!attachments && !content) throw new EmptyMessageException();
    const params = { groupId: id, author: user, content, attachments };
    const response = await this.groupMessageService.createGroupMessage(params);
    // this.eventEmitter.emit('group.message.create', response);
    return;
  }

  @Get()
  @SkipThrottle()
  async getGroupMessages(@GetUser() user: User, @Param('id') id: string) {
    console.log(`Fetching GroupMessages for Group Id: ${id}`);
    const messages = await this.groupMessageService.getGroupMessages(id);
    return { id, messages };
  }

  @Delete(':messageId')
  @SkipThrottle()
  async deleteGroupMessage(
    @GetUser() user: User,
    @Body('groupId') groupId: string,
    @Param('messageId') messageId: string,
  ) {
    await this.groupMessageService.deleteGroupMessage({
      userId: user.id,
      groupId,
      messageId,
    });
    // this.eventEmitter.emit('group.message.delete', {
    //   userId: user.id,
    //   messageId,
    //   groupId,
    // });
    return { groupId, messageId };
  }

  @Patch(':messageId')
  @SkipThrottle()
  async editGroupMessage(
    @GetUser() { id: userId }: User,
    @Body('id') groupId: string,
    @Param('messageId') messageId: string,
    @Body() { content }: EditMessageDto,
  ) {
    const params = { userId, content, groupId, messageId };
    const message = await this.groupMessageService.editGroupMessage(params);
    // this.eventEmitter.emit('group.message.update', message);
    return message;
  }
}
