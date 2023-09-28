import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login-user.dto';


@Controller('auth')
// @UseGuards(AuthGuard)
export class AuthController {

    constructor(private authService:AuthService){}

    @Post('register')
    register(@Body() registerUserDto:RegisterDto){
        // console.log('register api');
        // console.log(registerUserDto);
        return this.authService.register(registerUserDto);
    }

    @Post('login')
    login(@Body() loginUserDto:loginDto):Promise<any>{
        console.log(123);
        console.log(loginUserDto);
        return this.authService.login(loginUserDto);
    }

    // @Post('refresh-token')
    // @UseGuards(AuthGuard)
    // refreshToken(@Body() {refresh_token}):Promise<any>{
    //     console.log(3453);
    //     return this.authService.refreshToken(refresh_token);
    // }

    // @Post('change-password')
    // changePassword(@Body() changePasswordDto:ChangePassDto){
    //     console.log(123);
        
    // }
}
