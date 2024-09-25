import { Module } from '@nestjs/common';
import { Message } from './message.entity';
import { Conversation } from 'src/conversations/consersations.intity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './messages.service';
import { MessageController } from './messages.controller';
import { MessageAttachmentsModule } from 'src/message-attachments/message-attachments.module';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { ConversationsService } from 'src/conversations/conversations.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Conversation]),
    MessageAttachmentsModule,
    ConversationsModule,
    UserModule,
    AuthModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, ConversationsService],
})
export class MessagesModule {}
