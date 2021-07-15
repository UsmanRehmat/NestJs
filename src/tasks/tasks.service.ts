import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/auth.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repositotry';

@Injectable()
export class TasksService {
    constructor( 
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
    ) {}

    async getTasks(getTaskFilterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(getTaskFilterDto, user);

    }
  
    async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async getTaskById(id: number, user: User): Promise<Task>  {
        const task = await this.taskRepository.findOne({id, userId : user.id});
        if (!task) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
        return task;
    }

    async deleteTask(id: number, user: User): Promise<boolean>{

        const result = await this.taskRepository.delete({id, userId: user.id});
        if (result.affected === 1) {
            return true;
        } else {
            throw new NotFoundException(`Task with id ${id} not found`);
            
        }
    }

    async updateTask(id: number, status: TaskStatus, user: User): Promise<Task>{
        const task: Task = await this.getTaskById(id, user);
        if (task) {
            task.status = status;
            await task.save();
            return task;
        } else {
            throw new NotFoundException(`Task with ${id} not found`);
            
        }
        
    }
}
