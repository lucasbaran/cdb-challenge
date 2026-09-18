namespace Cdb.Infrastructure.Extensions;

using Cdb.Domain.Interfaces;
using Cdb.Domain.Services;
using Microsoft.Extensions.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddDomainServices();
        return services;
    }

    private static IServiceCollection AddDomainServices(this IServiceCollection services)
    {
        services.AddSingleton<ITaxCalculator, TaxCalculator>();
        services.AddSingleton<ICdbCalculator, CdbCalculator>();

        return services;
    }
}