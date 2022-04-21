import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { CreateTaskDto } from './dto/createTask.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {

    constructor(
        private readonly tasksService: TasksService
        ) {}

        
    
    @ApiBody({schema:{
        type: 'object', 
        properties:{
            UserName:{ type: 'string' },
            Email:{ type: "string" },
            Text: { type: 'string' },
        }}
    })
    @ApiOperation({summary: "Создать новую задачу"})
    @Post('/create')
    async CreateTask(@Body() task:CreateTaskDto)
    {
        return this.tasksService.createTask(task);
    }


    @ApiOperation({summary: "Выполнить задачу"})
    @UseGuards(JwtAuthGuard)
    @Get('/done/:value')
    async DoneTask(@Param('value') ID:number)
    {
        return this.tasksService.doneTask(ID);
    }

    @ApiOperation({summary: "Отредактировать задачу"})
    @ApiBearerAuth()
    @ApiBody({schema:{type: 'object', properties:{ID: {type: 'number'}, Text: {type: 'string'}}}})
    @UseGuards(JwtAuthGuard)
    @Post('/edit')
    async EditTask(@Body() task)
    {
        return this.tasksService.editTask(task.ID, task.Text);
    }

    @ApiOperation({summary: "Получить количество страниц"})
    @Get('/pages')
    getPages() {
      return this.tasksService.getPages();
    }
}
