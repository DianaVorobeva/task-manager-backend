import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { MessageAttachmentsModule } from 'src/message-attachments/message-attachments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { GroupMessage } from 'src/messages/group-message.entity';
import { GroupController } from './controllers/groups.controller';
import { GroupMessageController } from './controllers/group-messages.controller';
import { GroupRecipientsController } from './controllers/group-recipients.controller';
import { GroupService } from './services/groups.service';
import { GroupMessageService } from './services/group-messages.service';
import { GroupRecipientService } from './services/group-recipient.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    UserModule,
    MessageAttachmentsModule,
    TypeOrmModule.forFeature([Group, GroupMessage]),
    AuthModule,
  ],
  controllers: [
    GroupController,
    GroupMessageController,
    GroupRecipientsController,
  ],
  providers: [GroupService, GroupMessageService, GroupRecipientService],
})
export class GroupsModule {}
