import { Injectable, CanActivate, ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private userSerivce: UsersService) { }
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        try {
            //get token header
            const token = request.headers.authorization.split(' ')[1];

            if (!token) {
                throw new ForbiddenException('Vui long dua access')
            }
            //jwtVerify validate token
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.SECRET
            })
            //find user in db
            const user = await this.userSerivce.findByEmail(payload.email);
            if (!user) {
                throw new BadRequestException('Khong tim thay token');
            }
            //Gán user vào request
            request.currentUser = user;
        } catch (error) {
            throw new ForbiddenException('loi token')
        }
        return true;
    }
}