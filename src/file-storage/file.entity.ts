import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskEntity } from '../tasks/task.entity';

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  description: string;

  @Column()
  link: string;

  @ManyToOne(() => TaskEntity, (task) => task.files)
  tasks: TaskEntity[];

  @Column()
  fileName: string;
}
