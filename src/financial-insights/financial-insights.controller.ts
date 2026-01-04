import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { FinancialInsightsService } from './financial-insights.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('financial-insights')
export class FinancialInsightsController {
  constructor(
    private readonly service: FinancialInsightsService,
  ) {}

  @Get()
  async getByPeriod(
    @Req() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.service.getInsightByPeriod(
      req.user.id,
      new Date(startDate),
      new Date(endDate),
    );
  }
}
