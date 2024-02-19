import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { TokenModel } from 'src/auth/token.model';
import { GroupUserModel } from '../group/group-user.model';
import { GroupModel } from '../group/group.model';
import { ProjectUserModel } from '../project/project-user.model';
import { ProjectModel } from '../project/project.model';
import { MessageModel } from '../message/message.model';

interface UserCreationAttrs {
  email: string;
  password: string;
}

@Table({ tableName: 'user' })
export class UserModel extends Model<UserModel, UserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'the unique pointer' })
  @Column({ unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  email: string;

  @ApiProperty({ example: '1sfjsdfhdsf', description: 'The password' })
  @Column({ type: DataType.STRING, allowNull: true })
  password: string;

  @HasOne(() => TokenModel)
  token: TokenModel;

  @BelongsToMany(() => GroupModel, () => GroupUserModel)
  groups: GroupModel[];

  @BelongsToMany(() => ProjectModel, () => ProjectUserModel)
  projects: ProjectModel[];

  @HasMany(() => MessageModel)
  messages: MessageModel[];
}
