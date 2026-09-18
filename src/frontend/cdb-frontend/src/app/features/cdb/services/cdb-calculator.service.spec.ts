import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CdbCalculatorService } from './cdb-calculator.service';
import { ApiService } from '@core/services/api.service';
import { CalculateCdbRequest, CalculateCdbResponse } from '@features/cdb/models';

describe('CdbCalculatorService', () => {
  let service: CdbCalculatorService;
  let mockApiService: { post: jest.Mock };

  const mockResponse: CalculateCdbResponse = {
    initialValue: 1000,
    months: 12,
    grossValue: 1123.09,
    grossProfit: 123.09,
    taxRate: 0.20,
    tax: 24.62,
    netValue: 1098.47
  };

  beforeEach(() => {
    mockApiService = { post: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        CdbCalculatorService,
        { provide: ApiService, useValue: mockApiService }
      ]
    });

    service = TestBed.inject(CdbCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call apiService.post with correct endpoint and request', (done) => {
    const request: CalculateCdbRequest = { initialValue: 1000, months: 12 };
    mockApiService.post.mockReturnValue(of(mockResponse));

    service.calculate(request).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(mockApiService.post).toHaveBeenCalledWith('/calculate', request);
      done();
    });
  });

  it('should return response from api service', (done) => {
    const request: CalculateCdbRequest = { initialValue: 5000, months: 24 };
    const customResponse: CalculateCdbResponse = {
      initialValue: 5000,
      months: 24,
      grossValue: 6000,
      grossProfit: 1000,
      taxRate: 0.175,
      tax: 175,
      netValue: 5825
    };
    mockApiService.post.mockReturnValue(of(customResponse));

    service.calculate(request).subscribe(response => {
      expect(response).toEqual(customResponse);
      done();
    });
  });

  it('should propagate error from api service', (done) => {
    const request: CalculateCdbRequest = { initialValue: 1000, months: 12 };
    const error = new Error('Network error');
    mockApiService.post.mockReturnValue(throwError(() => error));

    service.calculate(request).subscribe({
      next: () => fail('should have errored'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });
});