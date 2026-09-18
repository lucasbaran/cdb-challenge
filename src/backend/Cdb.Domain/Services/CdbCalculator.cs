namespace Cdb.Domain.Services;

using Cdb.Domain.Constants;
using Cdb.Domain.Entities;
using Cdb.Domain.Interfaces;

public sealed class CdbCalculator : ICdbCalculator
{
    private readonly ITaxCalculator _taxCalculator;

    public CdbCalculator(ITaxCalculator taxCalculator)
    {
        _taxCalculator = taxCalculator;
    }

    public CdbInvestment Calculate(decimal initialValue, int months)
    {
        decimal currentValue = initialValue;

        for (int i = 0; i < months; i++)
        {
            currentValue = currentValue * (1 + CdbConstants.MonthlyRate);
        }

        decimal grossValue = currentValue;
        decimal grossProfit = grossValue - initialValue;
        decimal taxRate = _taxCalculator.GetTaxRate(months);
        decimal tax = _taxCalculator.CalculateTax(grossProfit, months);
        decimal netValue = grossValue - tax;

        return new CdbInvestment(
            initialValue,
            months,
            grossValue,
            grossProfit,
            taxRate,
            tax,
            netValue);
    }
}