import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SpendingAlertsService } from './spending-alerts.service';

@UseGuards(JwtAuthGuard)
@Controller('spending-alerts')
export class SpendingAlertsController {
    constructor(private readonly service: SpendingAlertsService) { }

    @Get()
    getAlerts(
        @Request() req,
        @Query('month') month: string,
        @Query('year') year: string,
    ) {
        return this.service.getAlerts(
            req.user.id,
            Number(month),
            Number(year),
        );
    }

    @Get('global')
    getGlobalAlert(
        @Request() req,
        @Query('month') month: string,
        @Query('year') year: string,
    ) {
        return this.service.getGlobalAlert(
            req.user.id,
            Number(month),
            Number(year),
        );
    }

    @Get('average')
    getAverage(
        @Request() req,
        @Query('months') months = '6',
    ) {
        return this.service.getMonthlyAverage(
            req.user.id,
            Number(months),
        );
    }

    @Get('trend')
    getTrend(@Request() req) {
        return this.service.getSpendingTrend(req.user.id);
    }

    @Get('debt-risk')
    getDebtRisk(@Request() req) {
        return this.service.getDebtRisk(req.user.id);
    }

}
