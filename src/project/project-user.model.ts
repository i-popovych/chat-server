import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../user/user.model';
import { ProjectModel } from './project.model';

interface ProjectUserCreationAttrs {
  isOwner?: boolean;
}

@Table({ tableName: 'project-user' })
export class ProjectUserModel extends Model<
  ProjectUserModel,
  ProjectUserCreationAttrs
> {
  @Column({ unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_owner: boolean;

  @ForeignKey(() => UserModel)
  @Column
  user_id: number;

  @ForeignKey(() => ProjectModel)
  @Column
  project_id: number;
}
