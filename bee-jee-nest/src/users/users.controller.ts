import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    //Используется для создания admin пользователя (НЕ МУСОР!!!)
    @Post('/create')
    create(@Body() userDto: CreateUserDto) {
      return this.userService.createUser(userDto);
    }

    @Post('/createpass')
    createPass(@Body() {password, salt}) {
      return this.userService.createUserPassword(password, salt);
    }
}
