import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  task: string;

  startTime: string;

  endTime: string;

  @IsNumber({}, { each: true })
  categoriesIds: number[];
}
