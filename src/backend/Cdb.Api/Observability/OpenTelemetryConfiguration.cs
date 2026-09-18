namespace Cdb.Api.Observability;

using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

public static class OpenTelemetryConfiguration
{
    public static void ConfigureOpenTelemetry(WebApplicationBuilder builder)
    {
        builder.Services.AddOpenTelemetry()
            .ConfigureResource(resource => resource
                .AddService("Cdb.Api"))
            .WithTracing(tracing => tracing
                .AddAspNetCoreInstrumentation()
                .AddHttpClientInstrumentation()
                .AddSource("Cdb.Api"));
    }
}