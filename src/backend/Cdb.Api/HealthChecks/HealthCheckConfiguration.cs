namespace Cdb.Api.HealthChecks;

using Microsoft.Extensions.Diagnostics.HealthChecks;

public static class HealthCheckConfiguration
{
    public static void ConfigureHealthChecks(IServiceCollection services)
    {
        services.AddHealthChecks()
            .AddCheck("self", () => HealthCheckResult.Healthy(), tags: new[] { "live" });
    }
}