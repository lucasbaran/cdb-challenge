# Implementation Plan - CDB Challenge

Based on analysis of SDD specifications vs current implementation.

## ✅ Already Implemented

### Backend (Complete)
- **Domain Layer**: `CdbCalculator`, `TaxCalculator`, `CdbInvestment`, interfaces, `CdbConstants`
- **Application Layer**: `CalculateCdbUseCase`, DTOs, `CalculateCdbRequestValidator`, `CdbMappingProfile`
- **API Layer**: `CalculateCdbEndpoint`, `Program.cs`, DI extensions, pipeline, versioning
- **Observability**: Serilog, OpenTelemetry, Correlation ID middleware
- **Error Handling**: `ErrorHandlingMiddleware` (ProblemDetails)
- **Health Checks**: `/health` endpoint
- **Infrastructure**: DI registration
- **Unit Tests**: All Domain + Application tests (matches 05-testing-specification.md)

### Frontend (Complete - Structure & Logic)
- **Core**: `ApiService`, `CorrelationIdInterceptor`, `ApiResponse` model
- **Shared**: `positiveNumberValidator`, `minIntegerValidator`, `CurrencyPtBrPipe`
- **Features/CDB**: `CalculatorPage`, `CdbFormComponent`, `CdbResultComponent`, `CdbCalculatorService`, Models

---

## 🔴 Missing - Must Implement

### 1. Backend Integration Tests (`tests/Cdb.IntegrationTests/`)
Per 05-testing-specification.md and 06-project-structure.md:

| File | Description |
|------|-------------|
| `Fixtures/WebAppFixture.cs` | `WebApplicationFactory<Program>` setup |
| `Endpoints/CalculateCdbEndpointTests.cs` | DI, middleware, validation, serialization |
| `Middleware/CorrelationIdMiddlewareTests.cs` | Header propagation, generation |
| `Cdb.IntegrationTests.csproj` | References: Cdb.Api, Application, Domain, Infrastructure |

**Test Cases (from spec):**
- DI container resolves all services
- Middleware pipeline (correlation ID, error handling)
- FluentValidation integration
- Endpoint serialization/deserialization
- ProblemDetails format validation

### 2. Backend API Tests (`tests/Cdb.ApiTests/`)
Per 05-testing-specification.md:

| File | Description |
|------|-------------|
| `CalculateCdbApiTests.cs` | HTTP contract tests |
| `HealthCheckApiTests.cs` | Health endpoint test |
| `Cdb.ApiTests.csproj` | References: Cdb.Api via WebApplicationFactory |

**Test Cases (from spec):**
- `POST_cdb_calculate_ValidRequest_Returns200`
- `POST_cdb_calculate_ZeroInitialValue_Returns400`
- `POST_cdb_calculate_OneMonth_Returns400`
- `POST_cdb_calculate_MissingFields_Returns400`
- `POST_cdb_calculate_ReturnsCorrectContentType`
- `POST_cdb_calculate_IncludesCorrelationId`
- `GET_health_Returns200`

### 3. Frontend Jest Tests (`src/frontend/cdb-frontend/src/`)
Per 04-technical-spec-frontend.md and 05-testing-specification.md - **NO TEST FILES EXIST**

| Component/Service | Test File | Key Scenarios |
|-------------------|-----------|---------------|
| `CdbFormComponent` | `cdb-form.component.spec.ts` | Validation messages, submit enable/disable, accessibility, min values |
| `CdbResultComponent` | `cdb-result.component.spec.ts` | Currency formatting (pt-BR), all fields displayed, tax rate % |
| `CalculatorPage` | `calculator.page.spec.ts` | Form submission, loading state, error display, result display, new calculation |
| `CdbCalculatorService` | `cdb-calculator.service.spec.ts` | HTTP call, success mapping, error mapping |
| `positiveNumberValidator` | `positive-number.validator.spec.ts` | Valid/invalid numbers, boundary values |
| `CurrencyPtBrPipe` | `currency-pt-br.pipe.spec.ts` | Formatting: R$ 1.234,56 |
| `CorrelationIdInterceptor` | `correlation-id.interceptor.spec.ts` | Header added, preserved from request |

**Coverage Targets (from spec):**
- Frontend Components: 80%
- Frontend Services: 90%

---

## 🟡 Quality Gates - Must Pass

```bash
# Backend
dotnet restore
dotnet build                    # No warnings (TreatWarningsAsErrors=true)
dotnet test                     # All tests pass, coverage > 90% Domain/Application
dotnet format                   # No formatting issues

# Frontend
cd src/frontend/cdb-frontend
npm install
npm test                        # Jest tests pass, coverage targets met
npm run build                   # Production build succeeds
```

---

## 📋 Implementation Order

### Phase 1: Backend Integration Tests (Priority: High)
1. Create `Cdb.IntegrationTests` project structure
2. Implement `WebAppFixture.cs`
3. Implement `CalculateCdbEndpointTests.cs`
4. Implement `CorrelationIdMiddlewareTests.cs`
5. Run `dotnet test` - verify integration tests pass

### Phase 2: Backend API Tests (Priority: High)
1. Create `Cdb.ApiTests` project structure
2. Implement `CalculateCdbApiTests.cs`
3. Implement `HealthCheckApiTests.cs`
4. Run `dotnet test` - verify API tests pass

### Phase 3: Frontend Jest Tests (Priority: High)
1. Create test files for all components/services/pipes/interceptors
2. Configure Jest (already has `jest.config.js`)
3. Run `npm test` - verify all tests pass with coverage

### Phase 4: Quality Verification (Priority: High)
1. Run full backend test suite: `dotnet test`
2. Run frontend test suite: `npm test`
3. Run `dotnet build` and `dotnet format`
4. Run frontend build: `npm run build`
5. Verify no Sonar issues, no warnings

---

## 🎯 Acceptance Criteria (from SDD)

### Backend API
- [ ] POST `/api/v1/cdb/calculate` returns 200 with correct response shape
- [ ] Validation errors return 400 with ProblemDetails
- [ ] Correlation ID header echoed in response
- [ ] Health check `/health` returns 200
- [ ] OpenAPI/Swagger available at `/swagger` (dev)

### Calculation Accuracy (from 01-functional-requirements.md)
- [ ] 1000, 6 months → Gross ≈ 1059.76, Net ≈ 1046.31, Tax 22.5%
- [ ] 1000, 12 months → Tax 20%
- [ ] 1000, 24 months → Tax 17.5%
- [ ] 1000, 36 months → Tax 15%
- [ ] Edge: 0.01, 2 months works
- [ ] Edge: 1000000, 60 months maintains precision

### Frontend
- [ ] Form validates: initialValue > 0, months > 1
- [ ] Loading spinner during request
- [ ] Disables form during request (no double submit)
- [ ] Shows user-friendly errors (Portuguese)
- [ ] Displays results with pt-BR currency formatting
- [ ] Accessible: labels, keyboard nav, screen reader

---

## 📁 File Creation Checklist

### Backend Integration Tests
- [ ] `tests/Cdb.IntegrationTests/Fixtures/WebAppFixture.cs`
- [ ] `tests/Cdb.IntegrationTests/Endpoints/CalculateCdbEndpointTests.cs`
- [ ] `tests/Cdb.IntegrationTests/Middleware/CorrelationIdMiddlewareTests.cs`

### Backend API Tests
- [ ] `tests/Cdb.ApiTests/CalculateCdbApiTests.cs`
- [ ] `tests/Cdb.ApiTests/HealthCheckApiTests.cs`

### Frontend Tests
- [ ] `src/frontend/cdb-frontend/src/app/features/cdb/components/cdb-form/cdb-form.component.spec.ts`
- [ ] `src/frontend/cdb-frontend/src/app/features/cdb/components/cdb-result/cdb-result.component.spec.ts`
- [ ] `src/frontend/cdb-frontend/src/app/features/cdb/pages/calculator/calculator.page.spec.ts`
- [ ] `src/frontend/cdb-frontend/src/app/features/cdb/services/cdb-calculator.service.spec.ts`
- [ ] `src/frontend/cdb-frontend/src/app/shared/validators/positive-number.validator.spec.ts`
- [ ] `src/frontend/cdb-frontend/src/app/shared/pipes/currency-pt-br.pipe.spec.ts`
- [ ] `src/frontend/cdb-frontend/src/app/core/interceptors/correlation-id.interceptor.spec.ts`

---

## ⚠️ Risk Areas

1. **Precision in tests**: Use `BeApproximately(expected, 0.01m)` for decimal comparisons
2. **Test isolation**: Each test must be independent (no shared state)
3. **Frontend test setup**: Ensure `jest-preset-angular` and `@angular/testing` configured
4. **Integration test DI**: Must properly test the actual DI container, not mocks
5. **Correlation ID**: Verify header flows through middleware → endpoint → response