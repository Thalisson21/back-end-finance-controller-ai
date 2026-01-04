import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateCategoryLimitDto } from './dto/create-category-limit.dto';
import { UpdateCategoryLimitDto } from './dto/update-category-limit.dto';

@Injectable()
export class CategoryLimitsService {
  constructor(private prisma: PrismaService) {}

 async create(userId: string, dto: CreateCategoryLimitDto) {
  const data: Prisma.CategoryLimitUncheckedCreateInput = {
    userId,
    categoryId: dto.categoryId,
    amount: new Prisma.Decimal(dto.amount),
    month: dto.month,
    year: dto.year,
  };

  return this.prisma.categoryLimit.create({ data });
}

  async findByPeriod(userId: string, month: number, year: number) {
    return this.prisma.categoryLimit.findMany({
      where: {
        userId,
        month,
        year,
      },
      include: {
        category: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.categoryLimit.findMany({
      where: { userId },
      include: { category: true },
    });
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateCategoryLimitDto,
  ) {
    const limit = await this.prisma.categoryLimit.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!limit || limit.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    return this.prisma.categoryLimit.update({
      where: { id },
      data: {
        amount: new Prisma.Decimal(dto.amount),
      },
    });
  }

  async remove(id: string, userId: string) {
    const limit = await this.prisma.categoryLimit.findFirst({
      where: { id },
    });

    if (!limit || limit.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    return this.prisma.categoryLimit.delete({
      where: { id },
    });
  }
}
