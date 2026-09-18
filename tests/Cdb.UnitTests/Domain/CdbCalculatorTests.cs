using Cdb.Domain.Entities;
using Cdb.Domain.Interfaces;
using Cdb.Domain.Services;
using FluentAssertions;
using Xunit;

namespace Cdb.UnitTests.Domain;

public class CdbCalculatorTests
{
    private readonly ICdbCalculator _calculator = new CdbCalculator(new TaxCalculator());

    [Fact]
    public void Calculate_ValidInput_ReturnsCorrectGrossValue()
    {
        var result = _calculator.Calculate(1000m, 6);

        result.GrossValue.Should().BeApproximately(1059.76m, 0.01m);
    }

    [Fact]
    public void Calculate_ValidInput_ReturnsCorrectNetValue()
    {
        var result = _calculator.Calculate(1000m, 6);

        result.NetValue.Should().BeApproximately(1046.31m, 0.01m);
    }

    [Fact]
    public void Calculate_OneMonth_AppliesMonthlyRateOnce()
    {
        var result = _calculator.Calculate(1000m, 1);

        result.GrossValue.Should().BeApproximately(1009.72m, 0.01m);
        result.GrossProfit.Should().BeApproximately(9.72m, 0.01m);
    }

    [Fact]
    public void Calculate_TwoMonths_CompoundsCorrectly()
    {
        var result = _calculator.Calculate(1000m, 2);

        var expectedMonth1 = 1000m * 1.00972m;
        var expectedMonth2 = expectedMonth1 * 1.00972m;
        result.GrossValue.Should().BeApproximately(expectedMonth2, 0.01m);
    }

    [Fact]
    public void Calculate_TwelveMonths_Applies20PercentTax()
    {
        var result = _calculator.Calculate(1000m, 12);

        result.TaxRate.Should().Be(0.20m);
    }

    [Fact]
    public void Calculate_ThirteenMonths_Applies17_5PercentTax()
    {
        var result = _calculator.Calculate(1000m, 13);

        result.TaxRate.Should().Be(0.175m);
    }

    [Fact]
    public void Calculate_TwentyFourMonths_Applies17_5PercentTax()
    {
        var result = _calculator.Calculate(1000m, 24);

        result.TaxRate.Should().Be(0.175m);
    }

    [Fact]
    public void Calculate_TwentyFiveMonths_Applies15PercentTax()
    {
        var result = _calculator.Calculate(1000m, 25);

        result.TaxRate.Should().Be(0.15m);
    }

    [Fact]
    public void Calculate_SixMonths_Applies22_5PercentTax()
    {
        var result = _calculator.Calculate(1000m, 6);

        result.TaxRate.Should().Be(0.225m);
    }

    [Fact]
    public void Calculate_SevenMonths_Applies20PercentTax()
    {
        var result = _calculator.Calculate(1000m, 7);

        result.TaxRate.Should().Be(0.20m);
    }

    [Fact]
    public void Calculate_LargeValues_MaintainsPrecision()
    {
        var result = _calculator.Calculate(1000000m, 60);

        result.GrossValue.Should().BeGreaterThan(1000000m);
        result.NetValue.Should().BeGreaterThan(1000000m);
        result.TaxRate.Should().Be(0.15m);
    }

    [Fact]
    public void Calculate_SmallValues_HandlesCentavos()
    {
        var result = _calculator.Calculate(0.01m, 2);

        result.GrossValue.Should().BeGreaterThan(0.01m);
        result.GrossProfit.Should().BeGreaterThan(0);
    }

    [Fact]
    public void Calculate_ReturnsAllExpectedFields()
    {
        var result = _calculator.Calculate(5000m, 18);

        result.InitialValue.Should().Be(5000m);
        result.Months.Should().Be(18);
        result.GrossValue.Should().BeGreaterThan(5000m);
        result.GrossProfit.Should().Be(result.GrossValue - 5000m);
        result.TaxRate.Should().Be(0.175m);
        result.Tax.Should().Be(result.GrossProfit * 0.175m);
        result.NetValue.Should().Be(result.GrossValue - result.Tax);
    }
}