import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './Entity/Users';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './Dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private userRepo: Repository<Users>
    ) { }

    async signUp(dto: RegisterDto) {
        const user = await this.userRepo.findOne({
            where: { email: dto.email }
        })
        const existingEmail = user?.email

        console.log('email', existingEmail)
        if (existingEmail) {
            throw new ConflictException(`this email ${existingEmail} already exists`)
        }
        const hashedPassword = await bcrypt.hash(dto.password.trim(), 10)

        const newUser = await this.userRepo.create({
            username: dto.username.trim(),
            email: dto.email.trim(),
            password: hashedPassword
        })

        await this.userRepo.save(newUser)
        return newUser
    }

    async findUser(email: string) {
        return await this.userRepo.findOne({
            where: { email },
            select: {
                id: true,
                username: true,
                email: true,
                password: true, // beacuse i set it '{select: flase}' in Users Entity
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

}
