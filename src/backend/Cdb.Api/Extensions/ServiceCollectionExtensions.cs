namespace Cdb.Api.Extensions;

using Asp.Versioning;
using Cdb.Api.HealthChecks;
using Cdb.Api.Observability;
using Cdb.Application.UseCases;
using Cdb.Application.Validators;
using Cdb.Infrastructure.Extensions;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, WebApplicationBuilder builder)
    {
        services.AddInfrastructure();
        services.AddApplicationServices();
        services.AddHealthChecksConfiguration();
        services.AddObservability(builder);
        services.AddApiVersioning();
        services.AddCorsPolicy(builder);

        return services;
    }

    private static IServiceCollection AddCorsPolicy(this IServiceCollection services, WebApplicationBuilder builder)
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? ["http://localhost"];

        services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy", policy =>
            {
                policy.WithOrigins(allowedOrigins)
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });

        return services;
    }

    private static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<CalculateCdbUseCase>();
        services.AddAutoMapper(typeof(Cdb.Application.Mapping.CdbMappingProfile).Assembly);
        services.AddValidatorsFromAssemblyContaining<Cdb.Application.Validators.CalculateCdbRequestValidator>();

        return services;
    }

    private static IServiceCollection AddHealthChecksConfiguration(this IServiceCollection services)
    {
        HealthCheckConfiguration.ConfigureHealthChecks(services);
        return services;
    }

    private static IServiceCollection AddApiVersioning(this IServiceCollection services)
    {
        services.AddApiVersioning(options =>
        {
            options.DefaultApiVersion = new ApiVersion(1, 0);
            options.AssumeDefaultVersionWhenUnspecified = true;
            options.ReportApiVersions = true;
        });

        return services;
    }

    public static IServiceCollection AddObservability(this IServiceCollection services, WebApplicationBuilder builder)
    {
        LoggingConfiguration.ConfigureSerilog(builder);
        OpenTelemetryConfiguration.ConfigureOpenTelemetry(builder);

        return services;
    }
}