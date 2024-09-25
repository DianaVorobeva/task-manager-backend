import { Attachment } from 'src/message-attachments/attachment.types';
import { Group } from './group.entity';
import { User } from 'src/user/user.entity';
import { GroupMessage } from 'src/messages/group-message.entity';

export type CreateGroupMessageResponse = {
  message: GroupMessage;
  group: Group;
};

export type DeleteGroupMessageParams = {
  userId: string;
  groupId: string;
  messageId: string;
};

export type AddGroupRecipientParams = {
  id: string;
  recipientId: string;
  userId: string;
};

export type RemoveGroupRecipientParams = {
  id: string;
  removeUserId: string;
  issuerId: string;
};

export type AddGroupUserResponse = {
  group: Group;
  user: User;
};

export type RemoveGroupUserResponse = {
  group: Group;
  user: User;
};

export type TransferOwnerParams = {
  userId: string;
  groupId: string;
  newOwnerId: string;
};

export type LeaveGroupParams = {
  id: string;
  userId: string;
};

export type CheckUserGroupParams = {
  id: string;
  userId: string;
};

export type UpdateGroupDetailsParams = {
  id: string;
  title?: string;
  avatar?: Attachment;
};

export type EditGroupMessageParams = {
  groupId: string;
  messageId: string;
  userId: string;
  content: string;
};

export type CreateGroupMessageParams = {
  author: User;
  attachments?: Attachment[];
  content: string;
  groupId: string;
};

export type FetchGroupsParams = {
  userId: string;
};
