import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseMessage } from './basic-message.entity';
import { Group } from 'src/groups/group.entity';
import { GroupMessageAttachment } from 'src/message-attachments/group-message-attachment.entity';
import { MessageAttachment } from 'src/message-attachments/message-attachment.entity';

@Entity({ name: 'group_messages' })
export class GroupMessage extends BaseMessage {
  @ManyToOne(() => Group, (group) => group.messages)
  group: Group;

  @OneToMany(() => GroupMessageAttachment, (attachment) => attachment.message)
  @JoinColumn()
  attachments?: MessageAttachment[];
}
