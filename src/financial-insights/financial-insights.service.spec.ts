import { Test, TestingModule } from '@nestjs/testing';
import { FinancialInsightsService } from './financial-insights.service';

describe('FinancialInsightsService', () => {
  let service: FinancialInsightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinancialInsightsService],
    }).compile();

    service = module.get<FinancialInsightsService>(FinancialInsightsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
