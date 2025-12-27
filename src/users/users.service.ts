import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/common/utils/hash';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateUserDto) {
    const hashedPassword = await hashPassword(data.password);

    const user = await this.prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
        },
    });

    const { password, ...result } = user;
    return result;
    }

    async getProfile(){
        return
    }

   async findAll() {
    return this.prisma.user.findMany({
            select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            },
        });
    }
}
