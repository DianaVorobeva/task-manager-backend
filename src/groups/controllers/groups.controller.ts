import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/user.entity';
import { TransferOwnerDto } from '../dto/TransferOwner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateGroupDetailsDto } from '../dto/UpdateGroupDetails.dto';
import { Attachment } from 'src/message-attachments/attachment.types';
import { CreateGroupDto } from '../dto/CreateGroup.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SkipThrottle } from '@nestjs/throttler';
import { GroupService } from '../services/groups.service';
import { AuthGuard } from '@nestjs/passport';

@SkipThrottle()
@Controller('groups')
@UseGuards(AuthGuard())
export class GroupController {
  constructor(
    @Inject() private readonly groupService: GroupService,
    // private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createGroup(@GetUser() user: User, @Body() params: CreateGroupDto) {
    const group = await this.groupService.createGroup(params, user);
    // this.eventEmitter.emit('group.create', group);
    return group;
  }

  @Get()
  getGroups(@GetUser() user: User) {
    return this.groupService.getGroups(user);
  }

  @Get(':id')
  getGroup(@GetUser() user: User, @Param('id') id: string) {
    return this.groupService.findGroupById(id);
  }

  @Patch(':id/owner')
  async updateGroupOwner(
    @GetUser() { id: userId }: User,
    @Param('id') groupId: string,
    @Body() { newOwnerId }: TransferOwnerDto,
  ) {
    const params = { userId, groupId, newOwnerId };
    const group = await this.groupService.transferGroupOwner(params);
    // this.eventEmitter.emit('group.owner.update', group);
    return group;
  }

  @Patch(':id/details')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateGroupDetails(
    @Body() { title }: UpdateGroupDetailsDto,
    @Param('id') id: string,
    @UploadedFile() avatar: Attachment,
  ) {
    console.log(avatar);
    console.log(title);
    return this.groupService.updateDetails({ id, avatar, title });
  }
}
