import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProjectModel } from '../project/project.model';
import { UserModel } from '../user/user.model';
import { GroupUserModel } from './group-user.model';
import { MessageModel } from '../message/message.model';

interface GroupCreationAttrs {
  group_name: string;
  project_id: number;
}

@Table({ tableName: 'group' })
export class GroupModel extends Model<GroupModel, GroupCreationAttrs> {
  @ApiProperty({ example: '1', description: 'the unique pointer' })
  @Column({ unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 'general', description: 'Group name' })
  @Column({ type: DataType.STRING })
  group_name: string;

  @ForeignKey(() => ProjectModel)
  @Column
  project_id: number;

  @BelongsTo(() => ProjectModel)
  project: ProjectModel;

  @BelongsToMany(() => UserModel, () => GroupUserModel)
  users: UserModel[];

  @HasMany(() => MessageModel)
  messages: MessageModel[];
}
