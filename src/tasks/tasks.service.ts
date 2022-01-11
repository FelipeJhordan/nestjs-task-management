import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  getTasksWithFilters({ status, search }: GetTaskFilterDto): Task[] {
    let tasksFiltered = this.getAllTasks();

    if (status) {
      tasksFiltered = this.tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasksFiltered = this.tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }

    return tasksFiltered;
  }

  createTask({ title, description }: CreateTaskDto): Task {
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  updateStatus(id: string, taskStatus: TaskStatus): Task {
    const index = this.tasks.findIndex((task) => task.id === id);
    this.tasks[index].status = taskStatus;
    return this.tasks[index];
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
