import { Test, TestingModule } from '@nestjs/testing';
import { SpendingAlertsController } from './spending-alerts.controller';

describe('SpendingAlertsController', () => {
  let controller: SpendingAlertsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpendingAlertsController],
    }).compile();

    controller = module.get<SpendingAlertsController>(SpendingAlertsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
