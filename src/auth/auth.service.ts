import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from 'src/users/Dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async login(dto: LoginDto) {
        const user: any = await this.usersService.findUser(dto.email)

        if(!user) throw new UnauthorizedException('no account with the given email');

        const isPasswordMatching = await bcrypt.compare(dto.password, user?.password)
        if(!isPasswordMatching) throw new UnauthorizedException('Wrong passowrd');

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        }
        console.log(payload)

        return {
            access_token: this.jwtService.sign(payload, {
                secret: this.configService.get<string>('JWT_SECRET') || 'SecretKey'
            }),
            user: {
                name: user.username,
                info: payload
            }
        }
    }
}
