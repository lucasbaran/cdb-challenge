# Functional Requirements Specification

## Overview
Web application for CDB (Certificate of Bank Deposit) investment calculation.

## Input Parameters
| Parameter | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| initialValue | decimal | > 0 | Initial monetary value for investment |
| months | integer | > 1 | Investment term in months |

## Output Results
| Result | Type | Description |
|--------|------|-------------|
| grossValue | decimal | Final accumulated value (bruto) |
| grossProfit | decimal | Gross profit = grossValue - initialValue |
| taxRate | decimal | Applied tax rate based on term |
| tax | decimal | Tax amount = grossProfit * taxRate |
| netValue | decimal | Net value after tax = grossValue - tax |

## Business Rules

### Compound Interest Calculation
- Monthly rate = CDI * BankPercentage = 0.009 * 1.08 = 0.00972 (0.972% per month)
- Formula per month: `CurrentValue = CurrentValue * (1 + MonthlyRate)`
- Result of month N becomes input for month N+1
- Initial value used only in month 1

### Tax Brackets (Regressive)
| Months Range | Tax Rate |
|--------------|----------|
| 1 - 6 | 22.5% |
| 7 - 12 | 20% |
| 13 - 24 | 17.5% |
| 25+ | 15% |

Tax applies only to gross profit (not principal).

## Fixed Values
- CDI = 0.009 (0.9% per month)
- BankPercentage (TB) = 1.08 (108% of CDI)
- MonthlyRate = 0.00972

## Acceptance Criteria

### Happy Path
1. Given initialValue = 1000, months = 6
   - Monthly rate = 0.00972
   - Gross value ≈ 1060.16
   - Gross profit ≈ 60.16
   - Tax rate = 22.5%
   - Tax ≈ 13.54
   - Net value ≈ 1046.62

2. Given initialValue = 1000, months = 12
   - Tax rate = 20%
   - Net value > gross value at 6 months

3. Given initialValue = 1000, months = 24
   - Tax rate = 17.5%

4. Given initialValue = 1000, months = 36
   - Tax rate = 15%

### Edge Cases
- initialValue = 0.01 (minimum positive)
- months = 2 (minimum valid)
- Large values: initialValue = 1000000, months = 60
- Decimal precision: verify centavos accuracy

### Validation Errors
- initialValue <= 0 → Validation error
- months <= 1 → Validation error
- Non-numeric inputs → Validation error