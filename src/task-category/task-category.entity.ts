import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
