import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SummaryService {
  constructor(private prisma: PrismaService) {}

  // =====================================
  // RESUMO FINANCEIRO POR PERÍODO
  // =====================================
  async getSummaryByPeriod(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
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

    for (const tx of transactions) {
      if (tx.category.type === 'INCOME') {
        income += Number(tx.amount);
      } else {
        expense += Number(tx.amount);
      }
    }

    return {
      period: {
        startDate,
        endDate,
      },
      income,
      expense,
      balance: income - expense,
    };
  }

  // =====================================
  // GASTOS AGRUPADOS POR CATEGORIA (PERÍODO)
  // =====================================
  async getExpensesByCategoryByPeriod(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        category: {
          type: 'EXPENSE',
        },
      },
      include: {
        category: true,
      },
    });

    const result: Record<string, number> = {};

    for (const tx of transactions) {
      const categoryName = tx.category.name;
      result[categoryName] =
        (result[categoryName] || 0) + Number(tx.amount);
    }

    return {
      period: {
        startDate,
        endDate,
      },
      categories: Object.entries(result).map(
        ([category, total]) => ({
          category,
          total,
        }),
      ),
    };
  }

  // =====================================
  // HISTÓRICO DIÁRIO POR PERÍODO
  // =====================================
  async getDailyHistoryByPeriod(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
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
      orderBy: {
        date: 'asc',
      },
    });

    const history: Record<
      string,
      { income: number; expense: number }
    > = {};

    for (const tx of transactions) {
      const day = tx.date.toISOString().split('T')[0];

      if (!history[day]) {
        history[day] = { income: 0, expense: 0 };
      }

      if (tx.category.type === 'INCOME') {
        history[day].income += Number(tx.amount);
      } else {
        history[day].expense += Number(tx.amount);
      }
    }

    return {
      period: {
        startDate,
        endDate,
      },
      history: Object.entries(history).map(
        ([date, values]) => ({
          date,
          income: values.income,
          expense: values.expense,
        }),
      ),
    };
  }
}
