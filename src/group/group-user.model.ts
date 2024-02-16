import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UserModel } from '../user/user.model';
import { GroupModel } from './group.model';
import { DataTypes } from 'sequelize';

@Table({ tableName: 'group_user', createdAt: false, updatedAt: false })
export class GroupUserModel extends Model<GroupUserModel> {
  @Column({ unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataTypes.BOOLEAN, defaultValue: false })
  isCreator: boolean;

  @ForeignKey(() => UserModel)
  @Column
  user_id: number;

  @ForeignKey(() => GroupModel)
  @Column
  group_id: number;
}
