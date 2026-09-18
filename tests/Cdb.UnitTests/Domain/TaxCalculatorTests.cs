using Cdb.Domain.Interfaces;
using Cdb.Domain.Services;
using FluentAssertions;
using Xunit;

namespace Cdb.UnitTests.Domain;

public class TaxCalculatorTests
{
    private readonly ITaxCalculator _taxCalculator = new TaxCalculator();

    [Theory]
    [InlineData(1, 0.225)]
    [InlineData(3, 0.225)]
    [InlineData(6, 0.225)]
    public void GetTaxRate_UpTo6Months_Returns22_5Percent(int months, decimal expectedRate)
    {
        var rate = _taxCalculator.GetTaxRate(months);
        rate.Should().Be(expectedRate);
    }

    [Theory]
    [InlineData(7, 0.20)]
    [InlineData(10, 0.20)]
    [InlineData(12, 0.20)]
    public void GetTaxRate_7To12Months_Returns20Percent(int months, decimal expectedRate)
    {
        var rate = _taxCalculator.GetTaxRate(months);
        rate.Should().Be(expectedRate);
    }

    [Theory]
    [InlineData(13, 0.175)]
    [InlineData(18, 0.175)]
    [InlineData(24, 0.175)]
    public void GetTaxRate_13To24Months_Returns17_5Percent(int months, decimal expectedRate)
    {
        var rate = _taxCalculator.GetTaxRate(months);
        rate.Should().Be(expectedRate);
    }

    [Theory]
    [InlineData(25, 0.15)]
    [InlineData(36, 0.15)]
    [InlineData(60, 0.15)]
    public void GetTaxRate_Above24Months_Returns15Percent(int months, decimal expectedRate)
    {
        var rate = _taxCalculator.GetTaxRate(months);
        rate.Should().Be(expectedRate);
    }

    [Theory]
    [InlineData(1000, 6, 225)]
    [InlineData(1000, 12, 200)]
    [InlineData(1000, 24, 175)]
    [InlineData(1000, 36, 150)]
    public void CalculateTax_ValidProfit_ReturnsCorrectTax(decimal grossProfit, int months, decimal expectedTax)
    {
        var tax = _taxCalculator.CalculateTax(grossProfit, months);
        tax.Should().Be(expectedTax);
    }
}