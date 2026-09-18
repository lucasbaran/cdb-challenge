namespace Cdb.Api.Features.Cdb.Calculate;

using global::Cdb.Application.DTOs;
using global::Cdb.Application.UseCases;
using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

public static class CalculateCdbEndpoint
{
    public static RouteGroupBuilder MapCalculateCdb(this RouteGroupBuilder group)
    {
        group.MapPost("/calculate", HandleAsync)
            .WithName("CalculateCdb")
            .WithSummary("Calcula investimento em CDB")
            .WithDescription("Recebe valor inicial e prazo em meses, retorna valor bruto, líquido, rendimento e imposto.")
            .WithTags("CDB")
            .Produces<CalculateCdbResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        return group;
    }

    private static async Task<Results<Ok<CalculateCdbResponse>, ValidationProblem>> HandleAsync(
        CalculateCdbRequest request,
        CalculateCdbUseCase useCase,
        IValidator<CalculateCdbRequest> validator,
        CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            return TypedResults.ValidationProblem(validationResult.ToDictionary());
        }

        var response = useCase.Execute(request);
        return TypedResults.Ok(response);
    }
}