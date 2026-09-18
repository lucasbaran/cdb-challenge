using Cdb.Application.DTOs;
using Cdb.Application.Validators;
using FluentAssertions;
using FluentValidation.TestHelper;
using Xunit;

namespace Cdb.UnitTests.Application;

public class CalculateCdbRequestValidatorTests
{
    private readonly CalculateCdbRequestValidator _validator = new();

    [Fact]
    public void Validate_InitialValueZero_ReturnsError()
    {
        var request = new CalculateCdbRequest(0m, 12);
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.InitialValue)
            .WithErrorMessage("O valor inicial deve ser maior que zero.");
    }

    [Fact]
    public void Validate_InitialValueNegative_ReturnsError()
    {
        var request = new CalculateCdbRequest(-100m, 12);
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.InitialValue);
    }

    [Fact]
    public void Validate_MonthsOne_ReturnsError()
    {
        var request = new CalculateCdbRequest(1000m, 1);
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.Months)
            .WithErrorMessage("O prazo deve ser maior que 1 mês.");
    }

    [Fact]
    public void Validate_MonthsZero_ReturnsError()
    {
        var request = new CalculateCdbRequest(1000m, 0);
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.Months);
    }

    [Fact]
    public void Validate_MonthsNegative_ReturnsError()
    {
        var request = new CalculateCdbRequest(1000m, -5);
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.Months);
    }

    [Fact]
    public void Validate_ValidInput_Passes()
    {
        var request = new CalculateCdbRequest(1000m, 12);
        var result = _validator.TestValidate(request);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData(0.01, 2)]
    [InlineData(1000000, 60)]
    [InlineData(100.50, 24)]
    public void Validate_VariousValidInputs_Pass(decimal initialValue, int months)
    {
        var request = new CalculateCdbRequest(initialValue, months);
        var result = _validator.TestValidate(request);
        result.ShouldNotHaveAnyValidationErrors();
    }
}