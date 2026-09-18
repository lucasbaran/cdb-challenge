namespace Cdb.Domain.Services;

using Cdb.Domain.Constants;
using Cdb.Domain.Interfaces;

public sealed class TaxCalculator : ITaxCalculator
{
    public decimal GetTaxRate(int months)
    {
        foreach (var bracket in CdbConstants.TaxBrackets)
        {
            if (months <= bracket.MaxMonths)
            {
                return bracket.Rate;
            }
        }

        return CdbConstants.TaxBrackets[^1].Rate;
    }

    public decimal CalculateTax(decimal grossProfit, int months)
    {
        var rate = GetTaxRate(months);
        return grossProfit * rate;
    }
}