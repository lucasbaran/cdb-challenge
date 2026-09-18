namespace Cdb.Domain.Interfaces;

public interface ITaxCalculator
{
    decimal GetTaxRate(int months);
    decimal CalculateTax(decimal grossProfit, int months);
}