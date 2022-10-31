import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { TaskCategoryService } from './task-category.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('/category')
export class TaskCategoryController {
  constructor(private taskCategoryService: TaskCategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createCategoryCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Request() req,
  ) {
    return this.taskCategoryService.createTaskCategory(
      createCategoryDto,
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/list')
  getUsersCategories(@Request() req) {
    return this.taskCategoryService.getUserCategories(req.user.id);
  }

  @Get('/:id')
  getIdCategory(@Param('id') id: number) {
    return this.taskCategoryService.getCategoryById(id);
  }
}
