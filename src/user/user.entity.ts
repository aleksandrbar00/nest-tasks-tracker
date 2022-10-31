import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TaskCategoryEntity } from '../task-category/task-category.entity';
import { TaskEntity } from '../tasks/task.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  email: string;

  @Column()
  isConfirmed: boolean;

  @Column({
    default: null,
  })
  confirmationToken: string;

  @OneToMany(() => TaskCategoryEntity, (taskCategory) => taskCategory.author)
  taskCategories: TaskCategoryEntity[];

  @OneToMany(() => TaskEntity, (task) => task.author)
  tasks: TaskEntity[];
}
