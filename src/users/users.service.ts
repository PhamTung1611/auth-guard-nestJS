import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { RegisterDto } from 'src/auth/dto/register-user.dto';
@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users) private readonly userRepository: Repository<Users>){}

    async create(userData: RegisterDto){
        const user = this.userRepository.create(userData);
        return await this.userRepository.save(user);
    }
    async findAll(): Promise<Users[]>{
        return await this.userRepository.find();
    }

    async findByEmail(email:string){
        return this.userRepository.findOneBy({email});
    }
    
}
