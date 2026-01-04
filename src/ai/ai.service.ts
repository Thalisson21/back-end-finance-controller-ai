import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
    private model;

  constructor() {
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!,
    );

    this.model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
    });
  }

  async generateFinancialInsight(payload: {
    period: { startDate: Date; endDate: Date };
    summary: {
      income: number;
      expense: number;
      balance: number;
      expensePercentage: number;
      status: string;
    };
    topCategories: { name: string; total: number }[];
  }): Promise<string> {
    const prompt = this.buildPrompt(payload);

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      console.error('Gemini error:', error.message);
      return 'Não foi possível gerar insights financeiros no momento.';
    }
  }

  private buildPrompt(data: any): string {
    return `
Analise os dados financeiros abaixo e gere um insight claro, direto e acionável.

Período:
- Início: ${data.period.startDate.toISOString().slice(0, 10)}
- Fim: ${data.period.endDate.toISOString().slice(0, 10)}

Resumo:
- Receita: R$ ${data.summary.income}
- Despesas: R$ ${data.summary.expense}
- Saldo: R$ ${data.summary.balance}
- Percentual comprometido: ${data.summary.expensePercentage}%
- Situação: ${data.summary.status}

Categorias com maior gasto:
${data.topCategories
  .map((c) => `- ${c.name}: R$ ${c.total}`)
  .join('\n')}

Regras:
- Linguagem simples
- Seja objetivo
- Aponte riscos
- Sugira uma ação prática
- Não invente dados
- Todas as despesas já foram debitadas
`;
  }
}
