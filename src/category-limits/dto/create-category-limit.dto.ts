// src/category-limits/dto/create-category-limit.dto.ts
import { IsInt, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateCategoryLimitDto {
  @IsUUID()
  categoryId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsInt()
  month: number;

  @IsInt()
  year: number;
}
