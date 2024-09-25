import { Module } from '@nestjs/common';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { GroupsModule } from 'src/groups/groups.module';
import { MessagingGateway } from './gateway';
import { GatewaySessionManager } from './gateway.session';
import { Session } from './session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    ConversationsModule,
    GroupsModule,
  ],
  providers: [MessagingGateway, GatewaySessionManager],
  exports: [MessagingGateway, GatewaySessionManager],
});
export class GatewayModule {}
