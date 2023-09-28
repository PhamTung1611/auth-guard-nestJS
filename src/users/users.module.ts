import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UsersService,AuthService],
  controllers: [UsersController]
})
export class UsersModule {}
