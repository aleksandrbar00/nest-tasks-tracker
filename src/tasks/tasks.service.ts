import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity, TaskStatusEnum } from './task.entity';
import { Repository } from 'typeorm';
import { TaskCategoryEntity } from '../task-category/task-category.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { MailingService } from '../mailing/mailing.service';
import { UserService } from '../user/user.service';
import { addSeconds, differenceInMilliseconds, subMinutes } from 'date-fns';
import { EditTaskDto } from './dto/edit-task.dto';
import { FileStorageService } from '../file-storage/file-storage.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private tasksRepository: Repository<TaskEntity>,
    private scheduleRegistry: SchedulerRegistry,
    private usersService: UserService,
    private mailingService: MailingService,
    private fileStorageService: FileStorageService,
  ) {}

  getIdTask(id: number) {
    return this.tasksRepository.find({
      where: {
        id: id,
      },
      relations: {
        categories: true,
      },
    });
  }

  getExpirationNotifyTimeDiff(startTime: string, endTime: string) {
    return differenceInMilliseconds(
      subMinutes(new Date(endTime), 5),
      new Date(startTime),
    );
  }

  getExpirationTimeDiff(startTime: string, endTime: string) {
    return differenceInMilliseconds(
      addSeconds(new Date(endTime), 1),
      new Date(startTime),
    );
  }

  async expireTask(task: TaskEntity) {
    if (
      task.status === TaskStatusEnum.STARTED ||
      task.status === TaskStatusEnum.IN_PROGRESS ||
      task.status === TaskStatusEnum.DEFAULT
    ) {
      task.status = TaskStatusEnum.EXPIRED;
      this.tasksRepository.save(task);
    }
  }

  async notifyExpiration(task: TaskEntity, userMail: string) {
    this.mailingService.sendExpirationTaskMail(userMail, task.task);
  }

  registerTaskExpiresTimeouts(task: TaskEntity, email: string) {
    const expirationNotifyTimeDiff = this.getExpirationNotifyTimeDiff(
      task.startTime,
      task.endTime,
    );
    const expirationTimeDiff = this.getExpirationTimeDiff(
      task.startTime,
      task.endTime,
    );

    console.log(expirationNotifyTimeDiff, expirationTimeDiff);

    if (expirationNotifyTimeDiff > 0) {
      const notifyExpirationTimeout = setTimeout(
        () => this.notifyExpiration(task, email),
        expirationNotifyTimeDiff,
      );
      this.scheduleRegistry.addTimeout(
        'notify-expiration',
        notifyExpirationTimeout,
      );
    }

    const expirationTimeout = setTimeout(
      () => this.expireTask(task),
      expirationTimeDiff,
    );
    this.scheduleRegistry.addTimeout('expire-task', expirationTimeout);
  }

  async createTask(payload: CreateTaskDto, userId: number) {
    const task = new TaskEntity();
    const author = await this.usersService.getIdUser(userId);

    if (!author) throw new InternalServerErrorException();

    task.task = payload.task;
    task.author = author;

    if (payload.startTime) {
      task.startTime = payload.startTime;
    }

    if (payload.endTime) {
      task.endTime = payload.endTime;
    }

    if (payload.categoriesIds && payload.categoriesIds.length > 0) {
      const categories = [];
      payload.categoriesIds.forEach((id) => {
        const category = new TaskCategoryEntity();
        category.id = id;
        categories.push(category);
      });
      task.categories = categories;
    }

    const saved = await this.tasksRepository.save(task);

    if (task.startTime && task.endTime) {
      this.registerTaskExpiresTimeouts(task, author.email);
    }

    return saved;
  }

  async editTask(id: number, payload: EditTaskDto) {
    return this.tasksRepository.update(id, payload);
  }

  async startTask(id: number, userId: number) {
    const task = await this.tasksRepository.findOne({
      where: {
        id,
        author: {
          id: userId,
        },
      },
    });

    if (!task) throw new NotFoundException();

    if (task.status !== TaskStatusEnum.DEFAULT) {
      throw new InternalServerErrorException();
    }

    task.status = TaskStatusEnum.STARTED;
    return this.tasksRepository.save(task);
  }

  async finishTask(id: number, userId: number) {
    const task = await this.tasksRepository.findOne({
      where: {
        id,
        author: {
          id: userId,
        },
      },
    });

    if (!task) throw new NotFoundException();
    if (task.status === TaskStatusEnum.FINISHED) {
      throw new InternalServerErrorException();
    }

    task.status = TaskStatusEnum.FINISHED;

    return this.tasksRepository.save(task);
  }

  async getUserTasks(
    userId: number,
    filters?: {
      status?: TaskStatusEnum;
      sortName?: string;
      sortDir?: string;
    },
  ) {
    const whereOptions: Record<string, string> = {};
    const sortOptions: Record<string, string> = {};

    if (filters?.status) {
      whereOptions.status = filters.status;
    }

    if (filters?.sortName && filters?.sortDir) {
      sortOptions[filters?.sortName] = filters.sortDir;
    }

    return this.tasksRepository.find({
      where: {
        author: {
          id: userId,
        },
        ...whereOptions,
      },
      relations: ['files'],
      order: {
        ...sortOptions,
      },
    });
  }
}
