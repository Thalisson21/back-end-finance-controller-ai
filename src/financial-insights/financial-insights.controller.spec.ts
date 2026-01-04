import { Test, TestingModule } from '@nestjs/testing';
import { FinancialInsightsController } from './financial-insights.controller';

describe('FinancialInsightsController', () => {
  let controller: FinancialInsightsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialInsightsController],
    }).compile();

    controller = module.get<FinancialInsightsController>(FinancialInsightsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
