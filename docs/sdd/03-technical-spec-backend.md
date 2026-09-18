# Technical Specification - Backend

## Architecture: Clean Architecture

```
src/
├── Cdb.Api              # Presentation layer (Minimal APIs)
├── Cdb.Application      # Use cases, DTOs, validators
├── Cdb.Domain           # Business logic, entities, interfaces
└── Cdb.Infrastructure   # EF Core, Redis, observability
```

## Layer Responsibilities

### Cdb.Domain
- **Entities**: `CdbInvestment` (value object)
- **Interfaces**: `ICdbCalculator`, `ITaxCalculator`
- **Services**: `CdbCalculator`, `TaxCalculator`
- **Constants**: `CdbConstants` (CDI, TB, MonthlyRate, TaxBrackets)
- **No dependencies** on external frameworks

### Cdb.Application
- **DTOs**: `CalculateCdbRequest`, `CalculateCdbResponse`
- **Validators**: `CalculateCdbRequestValidator` (FluentValidation)
- **Use Cases**: `CalculateCdbUseCase`
- **Interfaces**: `ICdbCalculator` (from Domain)
- **References**: Domain only

### Cdb.Infrastructure
- **Implementations**: (none required for calculation)
- **Observability**: Serilog, OpenTelemetry configuration
- **Health Checks**: Basic health endpoint
- **References**: Application, Domain

### Cdb.Api
- **Endpoints**: `CalculateCdbEndpoint`
- **Middleware**: Correlation ID, Error handling, Logging
- **DI Configuration**: Service registration
- **OpenAPI**: Swagger configuration
- **References**: Application, Infrastructure

## Domain Models

### CdbInvestment (Value Object)
```csharp
public readonly record struct CdbInvestment
{
    public decimal InitialValue { get; }
    public int Months { get; }
    public decimal GrossValue { get; }
    public decimal GrossProfit { get; }
    public decimal TaxRate { get; }
    public decimal Tax { get; }
    public decimal NetValue { get; }
}
```

### ICdbCalculator
```csharp
public interface ICdbCalculator
{
    CdbInvestment Calculate(decimal initialValue, int months);
}
```

### ITaxCalculator
```csharp
public interface ITaxCalculator
{
    decimal GetTaxRate(int months);
    decimal CalculateTax(decimal grossProfit, int months);
}
```

## Constants (CdbConstants)
```csharp
public static class CdbConstants
{
    public const decimal Cdi = 0.009m;
    public const decimal BankPercentage = 1.08m;
    public const decimal MonthlyRate = 0.00972m; // Cdi * BankPercentage
    
    public static readonly TaxBracket[] TaxBrackets = new[]
    {
        new TaxBracket(6, 0.225m),
        new TaxBracket(12, 0.20m),
        new TaxBracket(24, 0.175m),
        new TaxBracket(int.MaxValue, 0.15m)
    };
}

public readonly record struct TaxBracket(int MaxMonths, decimal Rate);
```

## Calculation Algorithm

```csharp
public CdbInvestment Calculate(decimal initialValue, int months)
{
    decimal currentValue = initialValue;
    
    for (int i = 0; i < months; i++)
    {
        currentValue = currentValue * (1 + MonthlyRate);
    }
    
    decimal grossValue = currentValue;
    decimal grossProfit = grossValue - initialValue;
    decimal taxRate = _taxCalculator.GetTaxRate(months);
    decimal tax = _taxCalculator.CalculateTax(grossProfit, months);
    decimal netValue = grossValue - tax;
    
    return new CdbInvestment(
        initialValue, months, grossValue, grossProfit, 
        taxRate, tax, netValue
    );
}
```

## Validation Rules (FluentValidation)
- `initialValue` > 0
- `months` > 1
- Custom error messages in Portuguese

## Error Handling
- Validation errors → 400 Bad Request with ProblemDetails
- Unexpected errors → 500 Internal Server Error
- Correlation ID in all responses

## Observability
- **Serilog**: Structured logging to console/seq
- **OpenTelemetry**: HTTP, traces
- **Correlation ID**: X-Correlation-Id header propagation
- **Health Checks**: `/health` endpoint

## Performance
- O(n) complexity where n = months
- Stateless - no caching needed for calculation
- No database calls for core calculation
- Horizontal scaling ready

## Testing Strategy
- **Unit Tests**: Domain calculators, tax calculator, validators
- **Integration Tests**: DI, middleware, endpoint serialization
- **API Tests**: HTTP status, request/response, versioning
- **Coverage**: > 90% on Domain + Application