import { CurrencyPtBrPipe } from './currency-pt-br.pipe';

describe('CurrencyPtBrPipe', () => {
  let pipe: CurrencyPtBrPipe;

  beforeEach(() => {
    pipe = new CurrencyPtBrPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format positive number as BRL currency', () => {
    const result = pipe.transform(1000);
    expect(result).toBe('R$\u00A01.000,00');
  });

  it('should format number with decimals', () => {
    const result = pipe.transform(1234.56);
    expect(result).toBe('R$\u00A01.234,56');
  });

  it('should format zero', () => {
    const result = pipe.transform(0);
    expect(result).toBe('R$\u00A00,00');
  });

  it('should format small decimal values', () => {
    const result = pipe.transform(0.01);
    expect(result).toBe('R$\u00A00,01');
  });

  it('should format large numbers', () => {
    const result = pipe.transform(1000000);
    expect(result).toBe('R$\u00A01.000.000,00');
  });

  it('should return default for null', () => {
    const result = pipe.transform(null);
    expect(result).toBe('R$ 0,00');
  });

  it('should return default for undefined', () => {
    const result = pipe.transform(undefined);
    expect(result).toBe('R$ 0,00');
  });

  it('should return default for NaN', () => {
    const result = pipe.transform(NaN);
    expect(result).toBe('R$ 0,00');
  });

  it('should format tax value correctly', () => {
    const result = pipe.transform(24.62);
    expect(result).toBe('R$\u00A024,62');
  });

  it('should format gross value correctly', () => {
    const result = pipe.transform(1123.09);
    expect(result).toBe('R$\u00A01.123,09');
  });

  it('should format net value correctly', () => {
    const result = pipe.transform(1098.47);
    expect(result).toBe('R$\u00A01.098,47');
  });
});