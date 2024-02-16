import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { GroupModel } from '../group/group.model';
import { UserModel } from '../user/user.model';
import { ProjectUserModel } from './project-user.model';

interface ProjectCreationAttrs {
  project_name: string;
  owner_id: number;
  project_ref: number;
}

@Table({ tableName: 'project' })
export class ProjectModel extends Model<ProjectModel, ProjectCreationAttrs> {
  @ApiProperty({ example: '1', description: 'the unique pointer' })
  @Column({ unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 'the wishlist', description: 'Project name' })
  @Column({ type: DataType.STRING })
  project_name: string;

  @HasMany(() => GroupModel)
  groups: GroupModel[];

  @BelongsToMany(() => UserModel, () => ProjectUserModel)
  users: UserModel[];
}
