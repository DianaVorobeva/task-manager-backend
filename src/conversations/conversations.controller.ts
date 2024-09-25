import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateConversationDto } from './dto/CreateConversation.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/user.entity';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
@UseGuards(AuthGuard())
export class ConversationsController {
  constructor(
    private conversationsService: ConversationsService,
    // private readonly events: EventEmitter2,
  ) {}

  @Post()
  async createConversation(
    @GetUser() user: User,
    @Body() createConversationPayload: CreateConversationDto,
  ) {
    console.log('createConversation');
    const conversation = await this.conversationsService.createConversation(
      user,
      createConversationPayload,
    );
    // this.events.emit('conversation.create', conversation);
    return conversation;
  }

  @Get()
  async getConversations(@GetUser() { id }: User) {
    return this.conversationsService.getConversations(id);
  }

  @Get(':id')
  async getConversationById(@Param('id') id: string) {
    return this.conversationsService.findById(id);
  }
}
