import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './Dto/register.dto';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ) { }

    @Post('register')
    async createSecureServer(@Body() dto: RegisterDto) {
        return await this.usersService.signUp(dto)
    }
}

