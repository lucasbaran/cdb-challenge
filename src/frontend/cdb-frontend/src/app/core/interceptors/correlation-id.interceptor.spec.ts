import { HttpInterceptorFn } from '@angular/common/http';
import { correlationIdInterceptor } from './correlation-id.interceptor';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

describe('correlationIdInterceptor', () => {
  let interceptor: HttpInterceptorFn;
  let mockNext: HttpHandlerFn;
  let capturedReq: HttpRequest<unknown> | null;

  beforeEach(() => {
    interceptor = correlationIdInterceptor;
    capturedReq = null;
    mockNext = (req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> => {
      capturedReq = req;
      return of({} as HttpEvent<unknown>);
    };
  });

  it('should add X-Correlation-Id header when not present', () => {
    const req = new HttpRequest('GET', '/api/test');
    
    interceptor(req, mockNext).subscribe();

    expect(capturedReq).not.toBeNull();
    expect(capturedReq!.headers.has('X-Correlation-Id')).toBe(true);
    expect(capturedReq!.headers.get('X-Correlation-Id')).toBeTruthy();
  });

  it('should preserve existing X-Correlation-Id header', () => {
    const existingId = 'existing-correlation-id-123';
    const req = new HttpRequest('GET', '/api/test', {
      headers: new HttpHeaders({ 'X-Correlation-Id': existingId })
    });
    
    interceptor(req, mockNext).subscribe();

    expect(capturedReq).not.toBeNull();
    expect(capturedReq!.headers.get('X-Correlation-Id')).toBe(existingId);
  });

  it('should generate valid UUID when no header present', () => {
    const req = new HttpRequest('GET', '/api/test');
    
    interceptor(req, mockNext).subscribe();

    const correlationId = capturedReq!.headers.get('X-Correlation-Id');
    expect(correlationId).toBeTruthy();
    // UUID format: 8-4-4-4-12 hex digits
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(correlationId).toMatch(uuidRegex);
  });

  it('should call next with cloned request', () => {
    const req = new HttpRequest('POST', '/api/test', { data: 'test' });
    
    interceptor(req, mockNext).subscribe();

    expect(capturedReq).not.toBeNull();
    expect(capturedReq!.url).toBe('/api/test');
    expect(capturedReq!.method).toBe('POST');
  });

  it('should not modify other headers', () => {
    const req = new HttpRequest('GET', '/api/test', {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer token' })
    });
    
    interceptor(req, mockNext).subscribe();

    expect(capturedReq!.headers.get('Content-Type')).toBe('application/json');
    expect(capturedReq!.headers.get('Authorization')).toBe('Bearer token');
  });
});