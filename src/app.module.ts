import { Module } from '@nestjs/common';
import { TaskCategoryModule } from './task-category/task-category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskCategoryEntity } from './task-category/task-category.entity';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      host: '127.0.0.1',
      username: 'postgres',
      password: '0000',
      database: 'tasks-tracker',
      entities: [TaskCategoryEntity, UserEntity],
      synchronize: true,
    }),
    TaskCategoryModule,
    UserModule,
  ],
})
export class AppModule {}
