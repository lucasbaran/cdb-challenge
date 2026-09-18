import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError, delay } from 'rxjs';
import { CalculatorPage } from './calculator.page';
import { CdbCalculatorService } from '@features/cdb/services/cdb-calculator.service';
import { CalculateCdbRequest, CalculateCdbResponse } from '@features/cdb/models';
import { By } from '@angular/platform-browser';

describe('CalculatorPage', () => {
  let component: CalculatorPage;
  let fixture: ComponentFixture<CalculatorPage>;
  let mockCdbCalculatorService: { calculate: jest.Mock };

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
    mockCdbCalculatorService = { calculate: jest.fn().mockReturnValue(of(mockResponse).pipe(delay(10))) };

    await TestBed.configureTestingModule({
      imports: [CalculatorPage],
      providers: [
        { provide: CdbCalculatorService, useValue: mockCdbCalculatorService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial state with null result, no loading, no error', () => {
    expect(component.result).toBeNull();
    expect(component.loading).toBe(false);
    expect(component.error).toBeNull();
  });

  it('should call service and set result on successful calculation', fakeAsync(() => {
    const request: CalculateCdbRequest = { initialValue: 1000, months: 12 };
    component.onCalculate(request);

    expect(component.loading).toBe(true);
    expect(component.error).toBeNull();

    tick(20);

    expect(mockCdbCalculatorService.calculate).toHaveBeenCalledWith(request);
    expect(component.loading).toBe(false);
    expect(component.result).toEqual(mockResponse);
  }));

  it('should set error and stop loading on calculation error', fakeAsync(() => {
    const errorMessage = 'Erro ao calcular';
    mockCdbCalculatorService.calculate.mockReturnValue(throwError(() => new Error(errorMessage)));

    const request: CalculateCdbRequest = { initialValue: 1000, months: 12 };
    component.onCalculate(request);

    tick();

    expect(component.loading).toBe(false);
    expect(component.error).toBe(errorMessage);
    expect(component.result).toBeNull();
  }));

  it('should reset result and error on new calculation', () => {
    component.result = mockResponse;
    component.error = 'Some error';
    component.onNewCalculation();

    expect(component.result).toBeNull();
    expect(component.error).toBeNull();
  });
});