// src/category-limits/category-limits.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CategoryLimitsService } from './category-limits.service';
import { CreateCategoryLimitDto } from './dto/create-category-limit.dto';
import { UpdateCategoryLimitDto } from './dto/update-category-limit.dto';

@UseGuards(JwtAuthGuard)
@Controller('category-limits')
export class CategoryLimitsController {
  constructor(private readonly service: CategoryLimitsService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateCategoryLimitDto) {
    return this.service.create(req.user.sub, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.user.sub);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: UpdateCategoryLimitDto,
  ) {
    return this.service.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.service.remove(id, req.user.sub);
  }
}
