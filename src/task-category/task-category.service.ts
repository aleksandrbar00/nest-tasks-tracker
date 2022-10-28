import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskCategoryEntity } from './task-category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class TaskCategoryService {
  constructor(
    @InjectRepository(TaskCategoryEntity)
    private taskCategoriesRepository: Repository<TaskCategoryEntity>,
  ) {}

  async createTaskCategory(payload: CreateCategoryDto) {
    try {
      const taskCategory = new TaskCategoryEntity();
      taskCategory.name = payload.name;
      return await this.taskCategoriesRepository.save(taskCategory);
    } catch (e) {
      console.log(e);
    }
  }

  async getCategoryById(id: number) {
    return this.taskCategoriesRepository.findOneBy({ id });
  }
}
