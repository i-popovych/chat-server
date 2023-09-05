import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from 'src/user/user.model';

interface TokenCreationAttr {
  user_id: number;
  hash_rt: string;
}

@Table({ tableName: 'token' })
export class TokenModel extends Model<TokenModel, TokenCreationAttr> {
  @ApiProperty({ example: '1', description: 'the unique pointer' })
  @Column({ unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({
    example: 'dkfljdslfjlkfjdsk29302jwejd',
    description: 'Refresh token',
  })
  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  hash_rt: string;

  @ApiProperty({
    example: '3',
    description: 'a foreign key that refers to the user',
  })
  @ForeignKey(() => UserModel)
  @Column
  user_id: number;

  @BelongsTo(() => UserModel)
  user: UserModel;
}
