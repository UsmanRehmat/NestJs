import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses =[]; 
    transform(value: string, metadata: ArgumentMetadata) {
        console.log(value);
        if(!this.isStatusValid(value.toUpperCase())) {
            throw new BadRequestException(`${value} is an invalid status`);
            
        }
    }
    private isStatusValid(status: string) {
        const taskStatuses = Object.values(TaskStatus) as string[];
        const index = taskStatuses.indexOf(status);
        return index !== -1;
    }
}