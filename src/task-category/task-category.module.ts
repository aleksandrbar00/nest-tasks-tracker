import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskCategoryEntity } from './task-category.entity';
import { TaskCategoryService } from './task-category.service';
import { TaskCategoryController } from './task-category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TaskCategoryEntity])],
  exports: [],
  controllers: [TaskCategoryController],
  providers: [TaskCategoryService],
})
export class TaskCategoryModule {}
