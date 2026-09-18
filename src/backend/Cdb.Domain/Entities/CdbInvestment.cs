namespace Cdb.Domain.Entities;

public readonly record struct CdbInvestment
{
    public decimal InitialValue { get; init; }
    public int Months { get; init; }
    public decimal GrossValue { get; init; }
    public decimal GrossProfit { get; init; }
    public decimal TaxRate { get; init; }
    public decimal Tax { get; init; }
    public decimal NetValue { get; init; }

    public CdbInvestment(
        decimal initialValue,
        int months,
        decimal grossValue,
        decimal grossProfit,
        decimal taxRate,
        decimal tax,
        decimal netValue)
    {
        InitialValue = initialValue;
        Months = months;
        GrossValue = grossValue;
        GrossProfit = grossProfit;
        TaxRate = taxRate;
        Tax = tax;
        NetValue = netValue;
    }
}