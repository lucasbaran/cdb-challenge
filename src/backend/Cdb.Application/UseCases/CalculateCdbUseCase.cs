namespace Cdb.Application.UseCases;

using Cdb.Application.DTOs;
using Cdb.Domain.Entities;
using Cdb.Domain.Interfaces;

public sealed class CalculateCdbUseCase
{
    private readonly ICdbCalculator _calculator;

    public CalculateCdbUseCase(ICdbCalculator calculator)
    {
        _calculator = calculator;
    }

    public CalculateCdbResponse Execute(CalculateCdbRequest request)
    {
        var investment = _calculator.Calculate(request.InitialValue, request.Months);

        return new CalculateCdbResponse(
            investment.InitialValue,
            investment.Months,
            investment.GrossValue,
            investment.GrossProfit,
            investment.TaxRate,
            investment.Tax,
            investment.NetValue);
    }
}