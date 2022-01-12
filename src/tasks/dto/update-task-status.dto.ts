import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task.model';

export class UpdateTasksStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
