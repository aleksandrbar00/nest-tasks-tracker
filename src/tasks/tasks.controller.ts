import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusEnum } from './task.entity';
import { EditTaskDto } from './dto/edit-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '../file-storage/types';
import { TasksFilesService } from './tasks-files.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private tasksService: TasksService,
    private tasksFilesService: TasksFilesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    this.tasksService.createTask(createTaskDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Put('/:id/attachFile')
  attachFileToTask(
    @Param('id') id: string,
    @UploadedFile() file: BufferedFile,
  ) {
    return this.tasksFilesService.attachFile(file, +id);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Put('/:id/detachFile')
  detachTaskFile(@Param('id') id: string, @Query('fileName') fileName: string) {
    return this.tasksFilesService.detachFile(fileName, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/list')
  getUserTasks(
    @Query('status') status: TaskStatusEnum,
    @Query('sort') sort: string,
    @Request() req,
  ) {
    const filters: Record<string, string> = {};

    if (status) {
      filters.status = status;
    }

    if (sort) {
      const [sortName, sortDir] = sort.split(':');

      if (sortName && sortDir) {
        filters.sortName = sortName;
        filters.sortDir = sortDir;
      }
    }

    return this.tasksService.getUserTasks(req.user.id, filters);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/edit')
  editIdTask(@Param('id') id: string, @Body() editTaskDto: EditTaskDto) {
    return this.tasksService.editTask(+id, editTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getIdTask(@Param('id') id: string) {
    return this.tasksService.getIdTask(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/start')
  startTask(@Param('id') id: string, @Request() req) {
    return this.tasksService.startTask(+id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/finish')
  finishTask(@Param('id') id: string, @Request() req) {
    return this.tasksService.startTask(+id, req.user.id);
  }
}
