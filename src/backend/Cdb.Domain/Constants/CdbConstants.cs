namespace Cdb.Domain.Constants;

public static class CdbConstants
{
    public const decimal Cdi = 0.009m;
    public const decimal BankPercentage = 1.08m;
    public const decimal MonthlyRate = 0.00972m;

    public static readonly TaxBracket[] TaxBrackets =
    [
        new(6, 0.225m),
        new(12, 0.20m),
        new(24, 0.175m),
        new(int.MaxValue, 0.15m)
    ];
}

public readonly record struct TaxBracket(int MaxMonths, decimal Rate);