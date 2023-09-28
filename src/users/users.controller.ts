import { Body, Controller,Get,Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { CurrentUser } from './decorators/currentUser.decorator';
import { RoleGuard } from 'src/guards/role.guard';
 
@Controller('users')
export class UsersController {
    constructor (private readonly userService:UsersService,private readonly authService:AuthService){}

    @Get()
    @UseGuards(new RoleGuard(['user']))
    @UseGuards(AuthGuard)
    FindAll(): Promise<Users[]>{
      return this.userService.findAll();
    }

    @Get('/current-user')
    @UseGuards(AuthGuard)
    getCurrentUser(@CurrentUser() currentUser){
      return currentUser;
    }

}
