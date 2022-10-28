import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { TaskCategoryService } from './task-category.service';

@Controller('/category')
export class TaskCategoryController {
  constructor(private taskCategoryService: TaskCategoryService) {}

  @Post()
  createCategoryCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.taskCategoryService.createTaskCategory(createCategoryDto);
  }

  @Get('/:id')
  getIdCategory(@Param('id') id: number) {
    return this.taskCategoryService.getCategoryById(id);
  }
}
