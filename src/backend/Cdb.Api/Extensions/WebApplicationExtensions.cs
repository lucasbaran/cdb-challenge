namespace Cdb.Api.Extensions;

using Asp.Versioning;
using Cdb.Api.Features.Cdb.Calculate;
using Cdb.Api.Middleware;
using Cdb.Api.Observability;
using Cdb.Infrastructure.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Serilog;

public static class WebApplicationExtensions
{
    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "Cdb API v1");
                options.RoutePrefix = "swagger";
            });
        }

        app.UseHttpsRedirection();
        app.UseCors("CorsPolicy");
        app.UseMiddleware<CorrelationIdMiddleware>();
        app.UseMiddleware<ErrorHandlingMiddleware>();
        app.UseSerilogRequestLogging();
        app.MapHealthChecks("/health");
        app.MapApiEndpoints();

        return app;
    }

    private static void MapApiEndpoints(this WebApplication app)
    {
        var apiVersionSet = app.NewApiVersionSet()
            .HasApiVersion(new ApiVersion(1, 0))
            .ReportApiVersions()
            .Build();

        var v1 = app.MapGroup("/api/v1")
            .WithApiVersionSet(apiVersionSet);

        v1.MapCalculateCdb();
    }
}