using Cdb.Application.DTOs;
using Cdb.Application.UseCases;
using Cdb.Domain.Entities;
using Cdb.Domain.Interfaces;
using FluentAssertions;
using Moq;
using Xunit;

namespace Cdb.UnitTests.Application;

public class CalculateCdbUseCaseTests
{
    private readonly Mock<ICdbCalculator> _calculatorMock = new();
    private readonly CalculateCdbUseCase _useCase;

    public CalculateCdbUseCaseTests()
    {
        _useCase = new CalculateCdbUseCase(_calculatorMock.Object);
    }

    [Fact]
    public void Execute_ValidRequest_ReturnsResponse()
    {
        var investment = new CdbInvestment(
            1000m, 12, 1123.09m, 123.09m, 0.20m, 24.62m, 1098.47m);

        _calculatorMock
            .Setup(x => x.Calculate(1000m, 12))
            .Returns(investment);

        var request = new CalculateCdbRequest(1000m, 12);
        var response = _useCase.Execute(request);

        response.InitialValue.Should().Be(1000m);
        response.Months.Should().Be(12);
        response.GrossValue.Should().Be(1123.09m);
        response.GrossProfit.Should().Be(123.09m);
        response.TaxRate.Should().Be(0.20m);
        response.Tax.Should().Be(24.62m);
        response.NetValue.Should().Be(1098.47m);

        _calculatorMock.Verify(x => x.Calculate(1000m, 12), Times.Once);
    }
}