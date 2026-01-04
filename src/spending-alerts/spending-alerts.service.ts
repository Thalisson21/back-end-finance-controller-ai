import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SpendingAlertsService {
    constructor(private prisma: PrismaService) { }

    async getAlerts(userId: string, month: number, year: number) {
        // 1️⃣ Buscar limites por categoria
        const limits = await this.prisma.categoryLimit.findMany({
            where: {
                userId,
                month,
                year,
            },
            include: {
                category: true,
            },
        });

        if (!limits.length) {
            return {
                month,
                year,
                alerts: [],
                message: 'Nenhum limite configurado para este período.',
            };
        }

        // 2️⃣ Buscar gastos do mês
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

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

        // 3️⃣ Somar gastos por categoria
        const spentByCategory: Record<string, number> = {};

        for (const tx of transactions) {
            const categoryId = tx.categoryId;
            spentByCategory[categoryId] =
                (spentByCategory[categoryId] || 0) + Number(tx.amount);
        }

        // 4️⃣ Gerar alertas
        const alerts = limits.map((limit) => {
            const spent = spentByCategory[limit.categoryId] || 0;
            const limitAmount = Number(limit.amount);
            const percentage = (spent / limitAmount) * 100;

            let status: 'OK' | 'WARNING' | 'EXCEEDED' = 'OK';

            if (percentage >= 100) {
                status = 'EXCEEDED';
            } else if (percentage >= 80) {
                status = 'WARNING';
            }

            return {
                categoryId: limit.categoryId,
                category: limit.category.name,
                limit: limitAmount,
                spent,
                percentage: Number(percentage.toFixed(2)),
                status,
            };
        });

        return {
            month,
            year,
            alerts,
        };
    }

    async getGlobalAlert(userId: string, month: number, year: number) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const transactions = await this.prisma.transaction.findMany({
            where: {
                userId,
                date: { gte: startDate, lte: endDate },
            },
            include: { category: true },
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

        const balance = income - expense;
        const percentage = income > 0 ? (expense / income) * 100 : 0;

        let status: 'OK' | 'WARNING' | 'CRITICAL' | 'DEFICIT' = 'OK';

        if (balance < 0) status = 'DEFICIT';
        else if (percentage >= 90) status = 'CRITICAL';
        else if (percentage >= 70) status = 'WARNING';

        return {
            month,
            year,
            income,
            expense,
            balance,
            percentage: Number(percentage.toFixed(2)),
            status,
        };
    }

    async getMonthlyAverage(userId: string, months: number) {
        const now = new Date();
        const startDate = new Date(
            now.getFullYear(),
            now.getMonth() - (months - 1),
            1,
        );

        const transactions = await this.prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: now,
                },
            },
            include: {
                category: true,
            },
        });

        const summaryByMonth: Record<
            string,
            { income: number; expense: number }
        > = {};

        for (const tx of transactions) {
            const key = `${tx.date.getFullYear()}-${tx.date.getMonth() + 1}`;

            if (!summaryByMonth[key]) {
                summaryByMonth[key] = { income: 0, expense: 0 };
            }

            if (tx.category.type === 'INCOME') {
                summaryByMonth[key].income += Number(tx.amount);
            } else {
                summaryByMonth[key].expense += Number(tx.amount);
            }
        }

        const monthsCount = Object.keys(summaryByMonth).length || 1;

        let totalIncome = 0;
        let totalExpense = 0;

        for (const month of Object.values(summaryByMonth)) {
            totalIncome += month.income;
            totalExpense += month.expense;
        }

        return {
            months: monthsCount,
            averageIncome: totalIncome / monthsCount,
            averageExpense: totalExpense / monthsCount,
            averageBalance: (totalIncome - totalExpense) / monthsCount,
        };
    }

    async getSpendingTrend(userId: string) {
        const now = new Date();

        const getRange = async (start: Date, end: Date) => {
            const txs = await this.prisma.transaction.findMany({
                where: {
                    userId,
                    date: { gte: start, lte: end },
                    category: { type: 'EXPENSE' },
                },
            });

            return txs.reduce(
                (sum, tx) => sum + Number(tx.amount),
                0,
            );
        };

        const recentStart = new Date(
            now.getFullYear(),
            now.getMonth() - 2,
            1,
        );
        const pastStart = new Date(
            now.getFullYear(),
            now.getMonth() - 5,
            1,
        );
        const pastEnd = new Date(
            now.getFullYear(),
            now.getMonth() - 3,
            0,
            23,
            59,
            59,
        );

        const recentTotal = await getRange(recentStart, now);
        const pastTotal = await getRange(pastStart, pastEnd);

        const recentAvg = recentTotal / 3;
        const pastAvg = pastTotal / 3;

        let trend: 'UP' | 'DOWN' | 'STABLE' = 'STABLE';

        if (recentAvg > pastAvg * 1.05) trend = 'UP';
        else if (recentAvg < pastAvg * 0.95) trend = 'DOWN';

        return {
            recentAverage: recentAvg,
            pastAverage: pastAvg,
            trend,
        };
    }

    async getDebtRisk(userId: string) {
        const average = await this.getMonthlyAverage(userId, 6);

        let risk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';

        if (average.averageExpense > average.averageIncome) {
            risk = 'HIGH';
        } else if (
            average.averageExpense >= average.averageIncome * 0.8
        ) {
            risk = 'MEDIUM';
        }

        return {
            averageIncome: average.averageIncome,
            averageExpense: average.averageExpense,
            risk,
        };
    }


}
