import { use } from "passport";
import { User } from "src/auth/auth.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { GetTaskFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
        const {title, description} = createTaskDto;
        const task: Task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.userId = user.id;
        await task.save();
        return task;
    }

    async getTasks(filterTask: GetTaskFilterDto, user: User): Promise<Task[]> {
        const {status, search} = filterTask;
        const query = this.createQueryBuilder('task');
        query.where('task.userId = :userId', {userId: user.id});
        if(status) {
            query.andWhere('task.status = :status', {status});
        }
        if(search) {
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', {search: `%${search}%`})
        }
        const tasks = await query.getMany();
        return tasks;
    }

}