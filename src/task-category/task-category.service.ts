import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskCategoryEntity } from './task-category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class TaskCategoryService {
  constructor(
    @InjectRepository(TaskCategoryEntity)
    private taskCategoriesRepository: Repository<TaskCategoryEntity>,
  ) {}

  async createTaskCategory(payload: CreateCategoryDto, authorId: number) {
    try {
      const taskCategory = new TaskCategoryEntity();
      taskCategory.name = payload.name;
      const author = new UserEntity();
      author.id = authorId;
      taskCategory.author = author;
      return await this.taskCategoriesRepository.save(taskCategory);
    } catch (e) {
      console.log(e);
    }
  }

  async getCategoryById(id: number) {
    return this.taskCategoriesRepository.findOneBy({ id });
  }

  async getUserCategories(userId: number) {
    return this.taskCategoriesRepository.findBy({
      author: {
        id: userId,
      },
    });
  }
}
