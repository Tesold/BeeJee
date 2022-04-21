import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { INET } from 'sequelize/types';
import { TasksService } from './tasks/tasks.service';

@Controller()
export class AppController {
  constructor(
    private readonly tasksService: TasksService
    ) {}

  @ApiOperation({summary: "Получить страницу задач (параметр - номер страницы)"})
  @Post('/')
  getTasks(@Body() body) {
    return this.tasksService.getTasks(body.page, body.order, body.orderfield);
  }



}
