namespace Cdb.IntegrationTests.Endpoints;

using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Routing;
using FluentAssertions;
using Xunit;
using Cdb.IntegrationTests.Fixtures;

[Collection("IntegrationTests")]
public class EndpointDiscoveryTests
{
    private readonly WebAppFixture _fixture;

    public EndpointDiscoveryTests(WebAppFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public void Endpoints_AreRegistered_InTestServer()
    {
        var endpoints = _fixture.Services.GetRequiredService<EndpointDataSource>().Endpoints;

        endpoints.Should().NotBeEmpty("Endpoints should be registered");

        var endpointRoutes = endpoints
            .Select(e => e.DisplayName)
            .Where(n => !string.IsNullOrEmpty(n))
            .ToList();

        endpointRoutes.Should().NotBeEmpty("At least some endpoints should have display names");

        // Print for debugging
        foreach (var route in endpointRoutes)
        {
            System.Console.WriteLine($"Endpoint: {route}");
        }

        // Check if our CDB endpoint is registered
        endpointRoutes.Should().Contain(e => e.Contains("calculate", StringComparison.OrdinalIgnoreCase),
            "CDB calculate endpoint should be registered");
    }
}