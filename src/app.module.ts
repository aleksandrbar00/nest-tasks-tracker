import { Module } from '@nestjs/common';
import { TaskCategoryModule } from './task-category/task-category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskCategoryEntity } from './task-category/task-category.entity';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { MailingModule } from './mailing/mailing.module';
import { TasksModule } from './tasks/tasks.module';
import { TaskEntity } from './tasks/task.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { FileStorageModule } from './file-storage/file-storage.module';
import { FileEntity } from './file-storage/file.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      host: '127.0.0.1',
      username: 'postgres',
      password: '0000',
      database: 'tasks-tracker',
      entities: [TaskCategoryEntity, UserEntity, TaskEntity, FileEntity],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    TaskCategoryModule,
    UserModule,
    MailingModule,
    AuthModule,
    TasksModule,
    FileStorageModule,
  ],
})
export class AppModule {}
