namespace Cdb.Application.Validators;

using FluentValidation;
using Cdb.Application.DTOs;

public sealed class CalculateCdbRequestValidator : AbstractValidator<CalculateCdbRequest>
{
    public CalculateCdbRequestValidator()
    {
        RuleFor(x => x.InitialValue)
            .GreaterThan(0)
            .WithMessage("O valor inicial deve ser maior que zero.");

        RuleFor(x => x.Months)
            .GreaterThan(1)
            .WithMessage("O prazo deve ser maior que 1 mês.");
    }
}