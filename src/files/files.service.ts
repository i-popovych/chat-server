import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';

@Injectable()
export class FilesService {
  async createFile(file: Express.Multer.File): Promise<string> {
    try {
      const fileName = randomUUID() + '.' + file.originalname.split('.').pop();
      const filePath = path.resolve(__dirname, '..', '..', 'static');

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch {
      throw new InternalServerErrorException(
        'An error occurred while trying to save a file',
      );
    }
  }

  async writeBufferFile(file: Buffer, extension: string) {
    try {
      const fileName = randomUUID() + '.' + extension;
      const filePath = path.resolve(__dirname, '..', '..', 'static');

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      fs.writeFileSync(path.join(filePath, fileName), file);
      return fileName;
    } catch (e) {
      console.error('[error createing file]', e);
      throw new InternalServerErrorException(
        'An error occurred while trying to save a file',
      );
    }
  }
}
