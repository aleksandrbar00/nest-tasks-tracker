import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './types';
import * as crypto from 'crypto';
import { FileEntity } from './file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FileStorageService {
  constructor(
    private readonly minioStorage: MinioService,
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,
  ) {}

  get client() {
    return this.minioStorage.client;
  }

  async upload(file: BufferedFile, bucketName: string) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException(
        'File type not supported',
        HttpStatus.BAD_REQUEST,
      );
    }

    const timestamp = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(timestamp)
      .digest('hex');
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const metaData = {
      'Content-Type': file.mimetype,
    };

    const fileName = hashedFileName + extension;
    const url = `localhost:9001/test/${fileName}`;
    try {
      const dbFile = new FileEntity();
      dbFile.fileName = fileName;
      dbFile.link = url;
      const [, dbSaved] = await Promise.all([
        this.client.putObject(bucketName, fileName, file.buffer, metaData),
        this.filesRepository.save(dbFile),
      ]);
      return {
        url,
        fileName,
        dbFile: dbSaved,
      };
    } catch (e) {
      if (e) {
        console.log(e);
        throw new HttpException(
          'Error uploading file',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async delete(objectName: string, bucketName: string) {
    try {
      await Promise.all([
        this.client.removeObject(bucketName, objectName),
        this.filesRepository.delete({
          fileName: objectName,
        }),
      ]);
    } catch (e) {
      throw new HttpException(
        'An error occured when deleting!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
