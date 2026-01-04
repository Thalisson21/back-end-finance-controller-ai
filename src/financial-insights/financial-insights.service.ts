import { Injectable } from '@nestjs/common';
import { AiService } from 'src/ai/ai.service';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class FinancialInsightsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async getInsightByPeriod(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    // 1️⃣ Buscar transações do período
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    let income = 0;
    let expense = 0;
    const categoryTotals: Record<string, number> = {};

    // 2️⃣ Processar dados
    for (const tx of transactions) {
      const amount = Number(tx.amount);

      if (tx.category.type === 'INCOME') {
        income += amount;
      } else {
        expense += amount;
        categoryTotals[tx.category.name] =
          (categoryTotals[tx.category.name] || 0) + amount;
      }
    }

    const balance = income - expense;
    const expensePercentage =
      income > 0 ? Number(((expense / income) * 100).toFixed(2)) : 0;

    const status =
      expensePercentage > 90
        ? 'CRITICAL'
        : expensePercentage > 70
        ? 'WARNING'
        : 'OK';

    const topCategories = Object.entries(categoryTotals)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    // ✅ 3️⃣ AQUI o aiPayload nasce (isso estava faltando)
    const aiPayload = {
      period: {
        startDate,
        endDate,
      },
      summary: {
        income,
        expense,
        balance,
        expensePercentage,
        status,
      },
      topCategories,
    };

    // 4️⃣ Chamada da IA
    const insight =
      await this.aiService.generateFinancialInsight(aiPayload);

    // 5️⃣ Retorno final
    return {
      period: {
        startDate,
        endDate,
      },
      income,
      expense,
      balance,
      expensePercentage,
      status,
      topCategories,
      insight:
        insight ??
        'Insight automático indisponível no momento.',
    };
  }
}
