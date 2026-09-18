# Technical Specification - Frontend

## Framework
- Angular 22 (Standalone Components)
- TypeScript
- Jest for testing

## Project Structure
```
src/app/
├── core/
│   ├── services/
│   │   └── api.service.ts          # HTTP client wrapper
│   ├── interceptors/
│   │   └── correlation-id.interceptor.ts
│   └── models/
│       └── api-response.model.ts
├── shared/
│   ├── components/
│   │   ├── input-field/
│   │   └── result-card/
│   ├── pipes/
│   │   └── currency-pt-br.pipe.ts
│   └── validators/
│       └── positive-number.validator.ts
└── features/
    └── cdb/
        ├── pages/
        │   └── calculator/
        │       ├── calculator.page.ts
        │       ├── calculator.page.html
        │       └── calculator.page.scss
        ├── components/
        │   ├── cdb-form/
        │   │   ├── cdb-form.component.ts
        │   │   ├── cdb-form.component.html
        │   │   └── cdb-form.component.scss
        │   └── cdb-result/
        │       ├── cdb-result.component.ts
        │       ├── cdb-result.component.html
        │       └── cdb-result.component.scss
        ├── services/
        │   └── cdb-calculator.service.ts
        └── models/
            ├── calculate-cdb-request.ts
            └── calculate-cdb-response.ts
```

## Models

### CalculateCdbRequest
```typescript
export interface CalculateCdbRequest {
  initialValue: number;
  months: number;
}
```

### CalculateCdbResponse
```typescript
export interface CalculateCdbResponse {
  initialValue: number;
  months: number;
  grossValue: number;
  grossProfit: number;
  taxRate: number;
  tax: number;
  netValue: number;
}
```

## Components

### CalculatorPage (Smart Component)
- Orchestrates form and result
- Handles loading/error states
- Calls CdbCalculatorService

### CdbForm (Presentational)
- Reactive Form with:
  - initialValue: required, min 0.01
  - months: required, min 2
- Portuguese labels and error messages
- Submit button with loading state
- Accessible (labels, aria-describedby)

### CdbResult (Presentational)
- Displays all fields from response
- Currency formatting (pt-BR): R$ 1.234,56
- Tax rate as percentage: 22,50%
- Clear visual hierarchy

## Services

### CdbCalculatorService
```typescript
@Injectable({ providedIn: 'root' })
export class CdbCalculatorService {
  calculate(request: CalculateCdbRequest): Observable<CalculateCdbResponse>
}
```
- Centralizes HTTP call to `/api/v1/cdb/calculate`
- Handles error mapping
- No business logic (backend is source of truth)

### ApiService
- Base HTTP client with interceptors
- Timeout configuration
- Standardized error handling

## Interceptors

### CorrelationIdInterceptor
- Adds/generates X-Correlation-Id header
- Preserves incoming correlation ID

## Validation (Frontend - UX only)
- initialValue: required, > 0
- months: required, > 1, integer
- Real-time validation feedback
- Submit disabled while invalid

## Error Handling
- User-friendly messages (Portuguese)
- No stack traces exposed
- Network error: "Erro de conexão. Tente novamente."
- Validation error: Show field-level messages
- Server error: "Erro ao calcular. Contate suporte."

## Loading & Concurrency
- Loading spinner on submit
- Disable form during request
- Prevent double submission

## Accessibility
- Semantic HTML (form, label, output)
- Keyboard navigation
- Focus management
- Color contrast (WCAG AA)
- Screen reader announcements for results

## Styling
- Angular Material or custom CSS
- Responsive design
- Portuguese locale formatting

## Testing (Jest)
- **Component Tests**: Form validation, result display, loading states
- **Service Tests**: HTTP calls, error mapping
- **Integration Tests**: Page flow success/error
- **Coverage**: Components, services, pipes, validators

## Environment Configuration
```typescript
// environment.ts
export const environment = {
  apiUrl: 'http://localhost:5000/api/v1'
};
```

## Build & Run
```bash
npm install
ng serve          # Development
ng build          # Production
npm test          # Jest tests
```