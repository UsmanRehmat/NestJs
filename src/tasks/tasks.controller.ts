import { Body, Delete, Param, ParseIntPipe, Patch, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Controller, Get, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { title } from 'process';
import { User } from 'src/auth/auth.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipe/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterTask: GetTaskFilterDto, @GetUser() user: User): Promise<Task[]> {
        return this.taskService.getTasks(filterTask, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDTO, @GetUser() user: User): Promise<Task> {
        return this.taskService.createTask(createTaskDto, user);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
        return this.taskService.getTaskById(id, user);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<boolean> {
        return this.taskService.deleteTask(id, user);
    }
    
    
    @Patch('/:id')
    updateTaskById(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus,  @GetUser() user: User): Promise<Task> {
        return this.taskService.updateTask(id, status, user);
    }
}
