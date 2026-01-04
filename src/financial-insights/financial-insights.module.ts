import { Module } from '@nestjs/common';
import { FinancialInsightsController } from './financial-insights.controller';
import { FinancialInsightsService } from './financial-insights.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [AiModule, PrismaModule],
  controllers: [FinancialInsightsController],
  providers: [FinancialInsightsService]
})
export class FinancialInsightsModule {}
