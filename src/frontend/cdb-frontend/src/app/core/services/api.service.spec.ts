import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, HttpClientModule } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '@environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const mockApiUrl = 'http://localhost:8080/api/v1';
  const originalApiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ApiService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);

    // Override the private baseUrl property
    (service as unknown as { baseUrl: string }).baseUrl = mockApiUrl;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should make GET request to correct endpoint', () => {
      const mockData = { test: 'data' };
      const endpoint = '/cdb/calculate';

      service.get(endpoint).subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${mockApiUrl}${endpoint}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('should handle error on GET request', () => {
      const endpoint = '/cdb/calculate';
      const errorResponse = { message: 'Server error' };

      service.get(endpoint).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Erro inesperado. Tente novamente.');
        },
      });

      const req = httpMock.expectOne(`${mockApiUrl}${endpoint}`);
      req.flush(errorResponse, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network error on GET request', () => {
      const endpoint = '/cdb/calculate';

      service.get(endpoint).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Erro de conexão: Network error');
        },
      });

      const req = httpMock.expectOne(`${mockApiUrl}${endpoint}`);
      req.error(new ProgressEvent('error'));
    });
  });

  describe('post', () => {
    it('should make POST request to correct endpoint with body', () => {
      const mockResponse = { success: true };
      const endpoint = '/cdb/calculate';
      const body = { initialValue: 1000, months: 12 };

      service.post(endpoint, body).subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${mockApiUrl}${endpoint}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(body);
      req.flush(mockResponse);
    });

    it('should handle error on POST request', () => {
      const endpoint = '/cdb/calculate';
      const body = { initialValue: 1000, months: 12 };
      const apiError = {
        title: 'Validation Error',
        errors: {
          initialValue: ['Valor deve ser positivo'],
          months: ['Prazo deve ser maior que 1'],
        },
      };

      service.post(endpoint, body).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Valor deve ser positivo, Prazo deve ser maior que 1');
        },
      });

      const req = httpMock.expectOne(`${mockApiUrl}${endpoint}`);
      req.flush(apiError, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle network error on POST request', () => {
      const endpoint = '/cdb/calculate';
      const body = { initialValue: 1000, months: 12 };

      service.post(endpoint, body).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Erro de conexão: Network error');
        },
      });

      const req = httpMock.expectOne(`${mockApiUrl}${endpoint}`);
      req.error(new ProgressEvent('error'));
    });
  });

  describe('handleError', () => {
    it('should return connection error message for ErrorEvent', () => {
      const errorEvent = new ErrorEvent('error', { message: 'Network error' });
      const httpError = new HttpErrorResponse({
        error: errorEvent,
        status: 0,
      });

      service['handleError'](httpError).subscribe({
        next: () => fail('should have failed'),
        error: (error: Error) => {
          expect(error.message).toBe('Erro de conexão: Network error');
        },
      });
    });

    it('should return api error title when available', () => {
      const apiError = { title: 'Custom Error', errors: {} };
      const httpError = new HttpErrorResponse({
        error: apiError,
        status: 400,
      });

      service['handleError'](httpError).subscribe({
        next: () => fail('should have failed'),
        error: (error: Error) => {
          expect(error.message).toBe('Custom Error');
        },
      });
    });

    it('should return validation error messages when available', () => {
      const apiError = {
        title: 'Validation Error',
        errors: {
          field1: ['Error 1', 'Error 2'],
          field2: ['Error 3'],
        },
      };
      const httpError = new HttpErrorResponse({
        error: apiError,
        status: 400,
      });

      service['handleError'](httpError).subscribe({
        next: () => fail('should have failed'),
        error: (error: Error) => {
          expect(error.message).toBe('Error 1, Error 2, Error 3');
        },
      });
    });

    it('should return server unavailable message for status 0', () => {
      const httpError = new HttpErrorResponse({
        error: {},
        status: 0,
        statusText: 'Unknown Error',
      });

      service['handleError'](httpError).subscribe({
        next: () => fail('should have failed'),
        error: (error: Error) => {
          expect(error.message).toBe('Servidor indisponível. Verifique sua conexão.');
        },
      });
    });

    it('should return default error message for unknown errors', () => {
      const httpError = new HttpErrorResponse({
        error: 'Unknown error',
        status: 500,
      });

      service['handleError'](httpError).subscribe({
        next: () => fail('should have failed'),
        error: (error: Error) => {
          expect(error.message).toBe('Erro inesperado. Tente novamente.');
        },
      });
    });
  });
});