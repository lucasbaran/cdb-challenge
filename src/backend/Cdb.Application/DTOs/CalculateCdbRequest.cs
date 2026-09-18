namespace Cdb.Application.DTOs;

public sealed record CalculateCdbRequest(
    decimal InitialValue,
    int Months);

public sealed record CalculateCdbResponse(
    decimal InitialValue,
    int Months,
    decimal GrossValue,
    decimal GrossProfit,
    decimal TaxRate,
    decimal Tax,
    decimal NetValue);