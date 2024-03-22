import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { GroupModel } from '../group/group.model';

import { UserModel } from '../user/user.model';
import { FileModel } from 'src/message/file.model';

interface MessageCreatingAttr {
  body: string;
  group_id: number;
  sender_id: number;
}

@Table({ tableName: 'message' })
export class MessageModel extends Model<MessageModel, MessageCreatingAttr> {
  @ApiProperty({ example: '1', description: 'the unique pointer' })
  @Column({ unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 'hi', description: 'mwssage name' })
  @Column({ type: DataType.STRING })
  body: string;

  @ForeignKey(() => UserModel)
  @Column
  sender_id: number;
  @BelongsTo(() => UserModel)
  users: UserModel;

  @ForeignKey(() => GroupModel)
  @Column
  group_id: number;
  @BelongsTo(() => GroupModel)
  groups: GroupModel;

  @HasMany(() => FileModel)
  files: FileModel[];
}
