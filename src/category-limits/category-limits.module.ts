// src/category-limits/category-limits.module.ts
import { Module } from '@nestjs/common';
import { CategoryLimitsService } from './category-limits.service';
import { CategoryLimitsController } from './category-limits.controller';

@Module({
  controllers: [CategoryLimitsController],
  providers: [CategoryLimitsService],
})
export class CategoryLimitsModule {}
