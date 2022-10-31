import { Injectable, NotFoundException } from '@nestjs/common';
import { FileStorageService } from '../file-storage/file-storage.service';
import { BufferedFile } from '../file-storage/types';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksFilesService {
  constructor(
    @InjectRepository(TaskEntity)
    private tasksRepository: Repository<TaskEntity>,
    private fileStorageService: FileStorageService,
  ) {}

  async attachFile(file: BufferedFile, taskId: number) {
    const { url, fileName, dbFile } = await this.fileStorageService.upload(
      file,
      'test',
    );

    const task = await this.tasksRepository.findOne({
      where: {
        id: taskId,
      },
      relations: ['files'],
    });

    if (!task) {
      this.fileStorageService.delete(fileName, 'test');
      throw new NotFoundException();
    }

    const newFiles = [...task.files, dbFile];
    task.files = newFiles;

    return this.tasksRepository.save(task);
  }

  async detachFile(fileName: string, taskId: number) {
    const task = await this.tasksRepository.findOne({
      where: {
        id: taskId,
      },
      relations: ['files'],
    });

    if (!task) throw new NotFoundException();

    task.files = task.files.filter((task) => task.fileName !== fileName);

    const [, dbSaved] = await Promise.all([
      this.fileStorageService.delete(fileName, 'test'),
      this.tasksRepository.save(task),
    ]);

    return dbSaved;
  }
}
