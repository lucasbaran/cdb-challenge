import { HttpInterceptorFn } from '@angular/common/http';

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const correlationIdInterceptor: HttpInterceptorFn = (req, next) => {
  const headerName = 'X-Correlation-Id';
  const correlationId = req.headers.get(headerName) ?? generateUUID();

  const clonedReq = req.clone({
    setHeaders: { [headerName]: correlationId }
  });

  return next(clonedReq);
};