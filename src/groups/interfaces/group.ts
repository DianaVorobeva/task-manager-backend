import { AccessParams } from 'src/conversations/conversations.types';
import { Group } from '../group.entity';
import {
  FetchGroupsParams,
  TransferOwnerParams,
  UpdateGroupDetailsParams,
} from '../group.types';
import { User } from 'src/user/user.entity';
import { CreateGroupDto } from '../dto/CreateGroup.dto';

export interface IGroupService {
  createGroup(params: CreateGroupDto, user: User);
  getGroups(user: User): Promise<Group[]>;
  findGroupById(id: string): Promise<Group>;
  saveGroup(group: Group): Promise<Group>;
  hasAccess(params: AccessParams): Promise<User | undefined>;
  transferGroupOwner(params: TransferOwnerParams): Promise<Group>;
  updateDetails(params: UpdateGroupDetailsParams): Promise<Group>;
}
