import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { SummaryModule } from './summary/summary.module';
import { CategoryLimitsModule } from './category-limits/category-limits.module';
import { SpendingAlertsModule } from './spending-alerts/spending-alerts.module';
import { FinancialInsightsModule } from './financial-insights/financial-insights.module';
import { AiModule } from './ai/ai.module';


@Module({
  imports: [PrismaModule, UsersModule, AuthModule, CategoriesModule, TransactionsModule, SummaryModule, CategoryLimitsModule, SpendingAlertsModule, FinancialInsightsModule, AiModule],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
