import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SummaryService } from './summary.service';

@UseGuards(JwtAuthGuard)
@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  // =========================
  // UTILITÁRIO LOCAL
  // =========================
  private parseDateRange(
    startDate?: string,
    endDate?: string,
  ): { start: Date; end: Date } {
    if (!startDate || !endDate) {
      throw new BadRequestException(
        'startDate and endDate are required (YYYY-MM-DD)',
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Use YYYY-MM-DD',
      );
    }

    if (start > end) {
      throw new BadRequestException(
        'startDate cannot be after endDate',
      );
    }

    // garante fim do dia
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  // =========================
  // RESUMO FINANCEIRO
  // =========================
  @Get()
  async getSummary(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const { start, end } = this.parseDateRange(startDate, endDate);

    return this.summaryService.getSummaryByPeriod(
      req.user.userId,
      start,
      end,
    );
  }

  // =========================
  // GASTOS POR CATEGORIA
  // =========================
  @Get('categories')
  async getExpensesByCategory(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const { start, end } = this.parseDateRange(startDate, endDate);

    return this.summaryService.getExpensesByCategoryByPeriod(
      req.user.userId,
      start,
      end,
    );
  }

  // =========================
  // HISTÓRICO DIÁRIO
  // =========================
  @Get('history')
  async getDailyHistory(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const { start, end } = this.parseDateRange(startDate, endDate);

    return this.summaryService.getDailyHistoryByPeriod(
      req.user.userId,
      start,
      end,
    );
  }
}
