import { BadRequestException,Request, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { loginDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(Users) private userRepository: Repository<Users>,
        private jwtService: JwtService,
        private userService:UsersService
    ) { }

    async register(registerUserDto: RegisterDto) {
        //check email
        const userByEmail = await this.userService.findByEmail(registerUserDto.email)
        if(userByEmail){
            throw new BadRequestException('Da co email');
        }
        //hash password
        const hashPassword = await bcrypt.hash(registerUserDto.password,10);
        registerUserDto.password = hashPassword;

        //save database
        const saveUser = await this.userService.create(registerUserDto)

        //generate jwt token
        const payload = {
            id:saveUser.id,
            name:saveUser.name,
            role:saveUser.role,
        };

        const accessToken = await this.jwtService.signAsync(payload,{
            secret: process.env.SECRET
        })

        return {
            msg:'success',
            accessToken
        }
    }

    async login(loginUserDto: loginDto): Promise<any> {
        const userByEmail = await this.userService.findByEmail(loginUserDto.email)
        if(!userByEmail){
            throw new BadRequestException('ko thay email');
        }
        //check pass
        const matchPassword = await bcrypt.compare(loginUserDto.password,userByEmail.password)

        if(!matchPassword){
            throw new BadRequestException('ko dung pass')
        }

        const payload = {
            id:userByEmail.id,
            name:userByEmail.name,
            email:userByEmail.email,
            role:userByEmail.role,
        };

        const accessToken = await this.jwtService.signAsync(payload,{
            secret: process.env.SECRET
        })

        return {
            msg:'success',
            accessToken
        }
    }

    // async getCurrentUser(@Request() req){
    //     return req.currentUser;//lay tu auth guard
        
    // }

    // async changePass(changePasswordDto: ChangePassDto) {
    //     const user = await this.userRepository.findOne({
    //         where: { username: changePasswordDto.username }
    //     });
    //     if (!user) {
    //         throw new HttpException("Not found user", HttpStatus.UNAUTHORIZED);
    //     } else {
    //         const checkPass = bcrypt.compareSync(changePasswordDto.password, user.password)
    //         if (!checkPass) {
    //             throw new HttpException("Password is not correct", HttpStatus.UNAUTHORIZED);
    //         } else {
    //             const password = this.checkPassword(changePasswordDto.passwordNew, changePasswordDto.passwordConfirm);
    //             if (!password) {
    //                 throw new HttpException("Password is not match", HttpStatus.UNAUTHORIZED);
    //             } else {
    //                 const hashPassword = await this.hashPassword(changePasswordDto.passwordNew)

    //                 return await this.userRepository.save({ ...changePasswordDto, refresh_token: "refresh_token_string", password: hashPassword });
    //             }
    //         }
    //     }
    // }
    //khi access token het han thì sẽ call tới hàm lại để làm mới
    // async refreshToken(refresh_token: string) {
    //     try {
    //         const verify = await this.jwtService.verifyAsync(refresh_token, {
    //             secret: this.configService.get<string>('SECRET')
    //         });
    //         const checkToken = await this.userRepository.findOneBy({
    //             username: verify.username, refresh_token
    //         })
    //         if (checkToken) {
    //             return this.generateToken({ id: verify.id, username: verify.username });
    //         } else {
    //             throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST);
    //         }
    //     } catch (error) {
    //         throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST);
    //     }
    // }

    //tao 1 token
    // private async generateToken(payload: { id: string, username: string }) {
    //     //tao access token
    //     const access_token = await this.jwtService.signAsync(payload);
    //     //tao refresh_token 
    //     const refresh_token = await this.jwtService.signAsync(payload, {
    //         secret: this.configService.get<string>('SECRET'),
    //         expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN')
    //     })
    //     //update vao db
    //     await this.userRepository.update(
    //         { username: payload.username },
    //         { refresh_token: refresh_token }
    //     )

    //     return { access_token, refresh_token }
    // }

    // private async hashPassword(password: string): Promise<string> {
    //     const saltRound = 10;
    //     const salt = await bcrypt.genSalt(saltRound);
    //     const hash = await bcrypt.hash(password, salt);
    //     return hash;
    // }

    // private async checkPassword(password: string, passwordConfirm: string) {
    //     if (password === passwordConfirm) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
}
