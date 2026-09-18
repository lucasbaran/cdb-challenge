# CDB Calculation Specification

## Input

InitialValue > 0

Months > 1

---

## Rates

CDI = 0.009

BankPercentage = 1.08

MonthlyRate = CDI * BankPercentage

MonthlyRate = 0.00972

---

## Compound calculation

For each month:

CurrentValue =
    CurrentValue * (1 + MonthlyRate)

InitialValue is used only in month 1.

The result of month N is the input
for month N+1.

---

## Gross result

GrossValue =
    FinalValue

GrossProfit =
    FinalValue - InitialValue

---

## Tax

Tax rate depends on investment period:

Months <= 6
22.5%

Months <= 12
20%

Months <= 24
17.5%

Months > 24
15%

---

## Net result

Tax =
    GrossProfit * TaxRate

NetValue =
    FinalValue - Tax