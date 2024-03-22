import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { MessageModel } from 'src/message/message.model';

interface FileCreatingAttr {
  fileName: string;
  filePath: string;
  message_id: number;
}

@Table({ tableName: 'files' })
export class FileModel extends Model<FileModel, FileCreatingAttr> {
  @ApiProperty({ example: 'file name', description: 'file name' })
  @Column({ type: DataType.STRING })
  fileName: string;

  @ApiProperty({ example: 'file name', description: 'file name' })
  @Column({ type: DataType.STRING })
  filePath: string;

  @ForeignKey(() => MessageModel)
  @Column
  message_id: number;
  @BelongsTo(() => MessageModel)
  message: MessageModel;
}
