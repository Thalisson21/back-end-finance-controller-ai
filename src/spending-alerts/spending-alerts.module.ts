import { Module } from '@nestjs/common';
import { SpendingAlertsService } from './spending-alerts.service';
import { SpendingAlertsController } from './spending-alerts.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SpendingAlertsController],
  providers: [SpendingAlertsService, PrismaService],
})
export class SpendingAlertsModule {}
