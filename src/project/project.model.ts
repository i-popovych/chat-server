import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../user/user.model';

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

  @ApiProperty({
    example: '324',
    description: 'Ref link on the project',
  })
  @Column({ type: DataType.INTEGER, unique: true })
  project_ref: number;

  @ForeignKey(() => UserModel)
  @Column
  owner_id: number;

  @BelongsTo(() => UserModel)
  user: UserModel;
}
