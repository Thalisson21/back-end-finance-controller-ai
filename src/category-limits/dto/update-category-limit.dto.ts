// src/category-limits/dto/update-category-limit.dto.ts
import { IsNumber, Min } from 'class-validator';

export class UpdateCategoryLimitDto {
  @IsNumber()
  @Min(0)
  amount: number;
}
