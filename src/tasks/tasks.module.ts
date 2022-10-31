import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { MailingModule } from '../mailing/mailing.module';
import { UserModule } from '../user/user.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { TasksFilesService } from './tasks-files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity]),
    MailingModule,
    UserModule,
    FileStorageModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksFilesService],
  exports: [],
})
export class TasksModule {}
