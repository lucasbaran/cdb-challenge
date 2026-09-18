import { CalculateCdbRequest, CalculateCdbResponse } from '@features/cdb/models';

describe('CDB Models Barrel Export', () => {
  it('should export CalculateCdbRequest type', () => {
    const request: CalculateCdbRequest = { initialValue: 1000, months: 12 };
    expect(request.initialValue).toBe(1000);
    expect(request.months).toBe(12);
  });

  it('should export CalculateCdbResponse type', () => {
    const response: CalculateCdbResponse = {
      initialValue: 1000,
      months: 12,
      grossValue: 1100,
      grossProfit: 100,
      taxRate: 22.5,
      tax: 22.5,
      netValue: 1077.5,
    };
    expect(response.grossValue).toBe(1100);
    expect(response.netValue).toBe(1077.5);
  });
});