import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CdbResultComponent } from './cdb-result.component';
import { CurrencyPtBrPipe } from '@shared/pipes/currency-pt-br.pipe';
import { CalculateCdbResponse } from '@features/cdb/models';
import { By } from '@angular/platform-browser';

describe('CdbResultComponent', () => {
  let component: CdbResultComponent;
  let fixture: ComponentFixture<CdbResultComponent>;

  const mockResponse: CalculateCdbResponse = {
    initialValue: 1000,
    months: 12,
    grossValue: 1123.09,
    grossProfit: 123.09,
    taxRate: 0.20,
    tax: 24.62,
    netValue: 1098.47
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CdbResultComponent, CurrencyPtBrPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(CdbResultComponent);
    component = fixture.componentInstance;
    component.result = mockResponse;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display initial value formatted as currency', () => {
    const valueElement = fixture.debugElement.query(By.css('.result-value'));
    expect(valueElement.nativeElement.textContent).toContain('R$');
  });

  it('should display all result fields', () => {
    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('Valor Inicial');
    expect(textContent).toContain('Prazo');
    expect(textContent).toContain('Valor Bruto');
    expect(textContent).toContain('Rendimento Bruto');
    expect(textContent).toContain('Alíquota de IR');
    expect(textContent).toContain('Imposto de Renda');
    expect(textContent).toContain('Valor Líquido');
  });

  it('should display months correctly', () => {
    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('12 meses');
  });

  it('should calculate taxRatePercent correctly', () => {
    expect(component.taxRatePercent).toBe('20,00%');
  });

  it('should display tax rate as percentage with comma', () => {
    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('20,00%');
  });

  it('should handle different tax rates', () => {
    component.result = { ...mockResponse, taxRate: 0.225 };
    fixture.detectChanges();
    expect(component.taxRatePercent).toBe('22,50%');

    component.result = { ...mockResponse, taxRate: 0.175 };
    fixture.detectChanges();
    expect(component.taxRatePercent).toBe('17,50%');

    component.result = { ...mockResponse, taxRate: 0.15 };
    fixture.detectChanges();
    expect(component.taxRatePercent).toBe('15,00%');
  });

  it('should apply positive class to grossValue, grossProfit, and netValue', () => {
    const positiveElements = fixture.debugElement.queryAll(By.css('.positive'));
    expect(positiveElements.length).toBe(3);
  });

  it('should apply negative class to tax', () => {
    const negativeElements = fixture.debugElement.queryAll(By.css('.negative'));
    expect(negativeElements.length).toBe(1);
  });
});