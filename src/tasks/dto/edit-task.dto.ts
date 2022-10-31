import { IsString } from 'class-validator';

export class EditTaskDto {
  @IsString()
  task: string;

  startTime: string;

  endTime: string;
}
