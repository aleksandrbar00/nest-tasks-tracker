import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { TaskCategoryEntity } from '../task-category/task-category.entity';
import { FileEntity } from '../file-storage/file.entity';

export enum TaskStatusEnum {
  STARTED = 'started',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
  EXPIRED = 'expired',
  DEFAULT = 'default',
}

@Entity()
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  task: string;

  @Column({
    nullable: true,
    type: 'timestamptz',
  })
  startTime: string;

  @Column({
    nullable: true,
    type: 'timestamptz',
  })
  endTime: string;

  @Column({
    nullable: true,
    type: 'timestamptz',
  })
  completeTime: string;

  @Column({
    type: 'enum',
    enum: TaskStatusEnum,
    default: TaskStatusEnum.DEFAULT,
  })
  status: string;

  @ManyToOne(() => UserEntity, (user) => user.tasks)
  author: UserEntity;

  @ManyToMany(() => TaskCategoryEntity)
  @JoinTable()
  categories: TaskCategoryEntity[];

  @OneToMany(() => FileEntity, (file) => file.tasks)
  files: FileEntity[];
}
