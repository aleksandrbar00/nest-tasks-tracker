import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { FileStorageService } from './file-storage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    MinioModule.register({
      endPoint: 'localhost',
      port: 9001,
      useSSL: false,
      accessKey: 'minio',
      secretKey: 'minio123',
    }),
  ],
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
