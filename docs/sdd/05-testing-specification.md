# Testing Specification

## Backend Testing Strategy

### Test Projects
```
tests/
├── Cdb.UnitTests/          # Domain + Application logic
├── Cdb.IntegrationTests/   # DI, middleware, endpoints
└── Cdb.ApiTests/           # HTTP contract tests
```

### Unit Tests (Cdb.UnitTests)

#### Domain - CdbCalculatorTests
| Test Method | Scenario |
|-------------|----------|
| `Calculate_ValidInput_ReturnsCorrectGrossValue` | 1000, 6 months |
| `Calculate_ValidInput_ReturnsCorrectNetValue` | 1000, 6 months |
| `Calculate_OneMonth_AppliesMonthlyRateOnce` | 1000, 1 month (edge) |
| `Calculate_TwoMonths_CompoundsCorrectly` | 1000, 2 months |
| `Calculate_TwelveMonths_Applies20PercentTax` | 1000, 12 months |
| `Calculate_ThirteenMonths_Applies17_5PercentTax` | 1000, 13 months |
| `Calculate_TwentyFourMonths_Applies17_5PercentTax` | 1000, 24 months |
| `Calculate_TwentyFiveMonths_Applies15PercentTax` | 1000, 25 months |
| `Calculate_SixMonths_Applies22_5PercentTax` | 1000, 6 months |
| `Calculate_SevenMonths_Applies20PercentTax` | 1000, 7 months |
| `Calculate_LargeValues_MaintainsPrecision` | 1000000, 60 months |
| `Calculate_SmallValues_HandlesCentavos` | 0.01, 2 months |

#### Domain - TaxCalculatorTests
| Test Method | Scenario |
|-------------|----------|
| `GetTaxRate_UpTo6Months_Returns22_5Percent` | 1-6 months |
| `GetTaxRate_7To12Months_Returns20Percent` | 7-12 months |
| `GetTaxRate_13To24Months_Returns17_5Percent` | 13-24 months |
| `GetTaxRate_Above24Months_Returns15Percent` | 25+ months |
| `CalculateTax_ValidProfit_ReturnsCorrectTax` | Various profits |

#### Application - CalculateCdbUseCaseTests
| Test Method | Scenario |
|-------------|----------|
| `Execute_ValidRequest_ReturnsResponse` | Happy path |
| `Execute_InvalidInitialValue_ReturnsValidationError` | <= 0 |
| `Execute_InvalidMonths_ReturnsValidationError` | <= 1 |

#### Application - CalculateCdbRequestValidatorTests
| Test Method | Scenario |
|-------------|----------|
| `Validate_InitialValueZero_ReturnsError` | 0 |
| `Validate_InitialValueNegative_ReturnsError` | -100 |
| `Validate_MonthsOne_ReturnsError` | 1 |
| `Validate_MonthsZero_ReturnsError` | 0 |
| `Validate_MonthsNegative_ReturnsError` | -5 |
| `Validate_ValidInput_Passes` | 1000, 12 |

### Integration Tests (Cdb.IntegrationTests)
- DI container resolves all services
- Middleware pipeline (correlation ID, error handling)
- FluentValidation integration
- Endpoint serialization/deserialization
- ProblemDetails format validation

### API Tests (Cdb.ApiTests)
| Test Method | Scenario |
|-------------|----------|
| `POST_cdb_calculate_ValidRequest_Returns200` | Success |
| `POST_cdb_calculate_ZeroInitialValue_Returns400` | Validation |
| `POST_cdb_calculate_OneMonth_Returns400` | Validation |
| `POST_cdb_calculate_MissingFields_Returns400` | Validation |
| `POST_cdb_calculate_ReturnsCorrectContentType` | application/json |
| `POST_cdb_calculate_IncludesCorrelationId` | Header present |
| `GET_health_Returns200` | Health check |

## Frontend Testing Strategy (Jest)

### Component Tests
- **CdbFormComponent**: Validation messages, submit enable/disable, accessibility
- **CdbResultComponent**: Formatting, all fields displayed, currency pipe
- **CalculatorPage**: Form submission, loading state, error display, result display

### Service Tests
- **CdbCalculatorService**: HTTP call, success mapping, error mapping

### Integration Tests
- Full page flow: fill form → submit → show result
- Error flow: submit → show error → retry

## Test Naming Convention
```
Method_Scenario_ExpectedResult
```
Examples:
- `Calculate_ValidInvestment_ShouldReturnGrossValue`
- `Calculate_SixMonths_ShouldApply22_5PercentTax`
- `Validate_ZeroInitialValue_ShouldReturnValidationError`

## Test Structure (AAA)
```csharp
[Fact]
public void Calculate_ValidInput_ReturnsCorrectGrossValue()
{
    // Arrange
    var calculator = new CdbCalculator(new TaxCalculator());
    var initialValue = 1000m;
    var months = 6;

    // Act
    var result = calculator.Calculate(initialValue, months);

    // Assert
    result.GrossValue.Should().BeApproximately(1060.16m, 0.01m);
    result.GrossProfit.Should().BeApproximately(60.16m, 0.01m);
    result.TaxRate.Should().Be(0.225m);
    result.NetValue.Should().BeApproximately(1046.62m, 0.01m);
}
```

## Precision Handling
- Use `BeApproximately(expected, 0.01m)` for decimal comparisons
- Test centavos (2 decimal places)
- Test rounding behavior explicitly

## Coverage Targets
| Layer | Minimum Coverage |
|-------|-----------------|
| Domain | 95% |
| Application | 90% |
| Overall Backend | 90% |
| Frontend Components | 80% |
| Frontend Services | 90% |

## Tools
- xUnit, FluentAssertions, Moq, AutoFixture, AutoFixture.AutoMoq
- Jest, @angular/testing, jest-preset-angular

## CI/CD Gates
- `dotnet test --collect:"XPlat Code Coverage"`
- Coverage threshold enforced
- No warnings allowed in build