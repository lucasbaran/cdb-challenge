import { HttpInterceptorFn } from '@angular/common/http';
import { correlationIdInterceptor, generateUUID } from './correlation-id.interceptor';
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

describe('generateUUID', () => {
  const originalRandomUUID = global.crypto?.randomUUID;

  afterEach(() => {
    if (global.crypto && originalRandomUUID) {
      global.crypto.randomUUID = originalRandomUUID;
    } else if (global.crypto) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete (global.crypto as { randomUUID?: unknown }).randomUUID;
    }
  });

  it('should generate valid UUID using crypto.randomUUID when available', () => {
    const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
    const mockRandomUUID = jest.fn().mockReturnValue(mockUUID);
    global.crypto.randomUUID = mockRandomUUID;

    const uuid = generateUUID();
    expect(uuid).toBe(mockUUID);
    expect(mockRandomUUID).toHaveBeenCalled();
  });

  it('should generate valid UUID using fallback when crypto.randomUUID is not available', () => {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (global.crypto as { randomUUID?: unknown }).randomUUID;

    const uuid = generateUUID();
    expect(uuid).toBeTruthy();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  });

  it('should generate different UUIDs on each call with fallback', () => {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (global.crypto as { randomUUID?: unknown }).randomUUID;

    const uuid1 = generateUUID();
    const uuid2 = generateUUID();

    expect(uuid1).not.toBe(uuid2);
  });

  it('should generate UUID with correct version (4) and variant (8,9,a,b) in fallback', () => {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (global.crypto as { randomUUID?: unknown }).randomUUID;

    const uuid = generateUUID();
    const parts = uuid.split('-');
    
    // Version 4: 3rd group starts with 4
    expect(parts[2][0]).toBe('4');
    // Variant: 4th group starts with 8, 9, a, or b
    expect(['8', '9', 'a', 'b']).toContain(parts[3][0].toLowerCase());
  });
});