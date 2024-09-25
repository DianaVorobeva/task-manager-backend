import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Conversation } from './consersations.intity';
import { ConversationsRepository } from './conversations.repository';
import { AuthModule } from 'src/auth/auth.module';
import { Message } from 'src/messages/message.entity';
import { UserService } from 'src/user/user.service';
import { UsersRepository } from 'src/user/users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message]),
    UserModule,
    AuthModule,
  ],
  controllers: [ConversationsController],
  providers: [
    ConversationsService,
    ConversationsRepository,
    UserService,
    UsersRepository,
  ],
  exports: [ConversationsService],
})
export class ConversationsModule {}
