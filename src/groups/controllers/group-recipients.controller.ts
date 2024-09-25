import { Body, Controller, Delete, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/user.entity';
import { AddGroupRecipientDto } from '../dto/AddGroupRecipient.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SkipThrottle } from '@nestjs/throttler';
import { GroupRecipientService } from '../services/group-recipient.service';
import { AuthGuard } from '@nestjs/passport';

@SkipThrottle()
@Controller('groupRecipients')
@UseGuards(AuthGuard())
export class GroupRecipientsController {
  constructor(
    @Inject()
    private readonly groupRecipientService: GroupRecipientService,
    // private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async addGroupRecipient(
    @GetUser() { id: userId }: User,
    @Param('id') id: string,
    @Body() { recipientId }: AddGroupRecipientDto,
  ) {
    const params = { id, userId, recipientId };
    const response = await this.groupRecipientService.addGroupRecipient(params);
    // this.eventEmitter.emit('group.user.add', response);
    return response;
  }

  /**
   * Leaves a Group
   * @param user the authenticated User
   * @param groupId the id of the group
   * @returns the updated Group that the user had left
   */
  @Delete('leave')
  async leaveGroup(@GetUser() user: User, @Param('id') groupId: string) {
    const group = await this.groupRecipientService.leaveGroup({
      id: groupId,
      userId: user.id,
    });
    // this.eventEmitter.emit('group.user.leave', { group, userId: user.id });
    return group;
  }

  @Delete(':userId')
  async removeGroupRecipient(
    @GetUser() { id: issuerId }: User,
    @Param('id') id: string,
    @Param('userId') removeUserId: string,
  ) {
    const params = { issuerId, id, removeUserId };
    const response =
      await this.groupRecipientService.removeGroupRecipient(params);
    // this.eventEmitter.emit('group.user.remove', response);
    return response.group;
  }
}
