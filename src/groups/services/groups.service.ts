import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FetchGroupsParams,
  TransferOwnerParams,
  UpdateGroupDetailsParams,
} from '../group.types';
import { Group } from '../group.entity';
import { GroupNotFoundException } from '../exceptions/GroupNotFound';
import { GroupOwnerTransferException } from '../exceptions/GroupOwnerTransfer';
import { AccessParams } from 'src/conversations/conversations.types';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { IGroupService } from '../interfaces/group';
import { Repository } from 'typeorm';
import { CreateGroupDto } from '../dto/CreateGroup.dto';

@Injectable()
export class GroupService implements IGroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @Inject()
    private readonly userService: UserService,
  ) {}

  async createGroup(params: CreateGroupDto, user: User) {
    const { title } = params;
    const usersPromise = params.users.map((id) =>
      this.userService.getUserById(id),
    );
    const users = (await Promise.all(usersPromise)).filter((user) => user);
    users.push(user);
    console.log(user);
    const groupParams = { owner: user, users, creator: user, title };
    const group = this.groupRepository.create(groupParams);
    return this.groupRepository.save(group);
  }

  getGroups(user: User): Promise<Group[]> {
    const userId = user.id;
    console.log(userId);
    return (
      this.groupRepository
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.users', 'user')
        // .where('user.id IN (:users)', { users: [userId] })
        .leftJoinAndSelect('group.users', 'users')
        .leftJoinAndSelect('group.creator', 'creator')
        .leftJoinAndSelect('group.owner', 'owner')
        .leftJoinAndSelect('group.lastMessageSent', 'lastMessageSent')
        .orderBy('group.lastMessageSentAt', 'DESC')
        .getMany()
    );
  }

  findGroupById(id: string): Promise<Group> {
    return this.groupRepository.findOne({
      where: { id },
      relations: ['creator', 'users', 'lastMessageSent', 'owner'],
    });
  }

  saveGroup(group: Group): Promise<Group> {
    return this.groupRepository.save(group);
  }

  async hasAccess({ id, userId }: AccessParams): Promise<User | undefined> {
    const group = await this.findGroupById(id);
    if (!group) throw new GroupNotFoundException();
    return group.users.find((user) => user.id === userId);
  }

  async transferGroupOwner({
    userId,
    groupId,
    newOwnerId,
  }: TransferOwnerParams): Promise<Group> {
    const group = await this.findGroupById(groupId);
    if (!group) throw new GroupNotFoundException();
    if (group.owner.id !== userId)
      throw new GroupOwnerTransferException('Insufficient Permissions');
    if (group.owner.id === newOwnerId)
      throw new GroupOwnerTransferException(
        'Cannot Transfer Owner to yourself',
      );
    const newOwner = await this.userService.getUserById(newOwnerId);
    if (!newOwner) throw new NotFoundException();
    group.owner = newOwner;
    return this.groupRepository.save(group);
  }

  async updateDetails(params: UpdateGroupDetailsParams): Promise<Group> {
    const group = await this.findGroupById(params.id);
    if (!group) throw new GroupNotFoundException();

    group.title = params.title ?? group.title;
    return this.groupRepository.save(group);
  }
}
