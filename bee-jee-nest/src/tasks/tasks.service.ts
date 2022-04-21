import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTaskDto } from './dto/createTask.dto';
import { Task } from './tasks.model';

@Injectable()
export class TasksService {
    constructor(
        @InjectModel(Task) private tasksRepository: typeof Task,
      ){}

    async getTasks(page:number, order: any, orderfield:any){

        return this.tasksRepository.findAll({
            order: [[orderfield?orderfield:"ID", order?order:"ACS"]],
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            limit: 3, 
            offset: page>0?(page-1)*3:0
    })}

    async createTask(task: CreateTaskDto){
        this.tasksRepository.create(task);

        return "Задача создана!"
    }

    async doneTask(ID: number){
        try{
        this.tasksRepository.update({Status: true}, {where: {ID}});

        return "Задача выполнена!"
        }
        catch { return "задача провалена!"}
    }

    async editTask(ID: number, Text: string){
        try{
            this.tasksRepository.update({Text, Edited: true}, {where: {ID}});

            return "Задача отредактирована!"
        }
        catch
        {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
    }

    async getPages()
    {
        const count = (await this.tasksRepository.findAndCountAll()).count;

        return Math.ceil(count/3);
    }
}
