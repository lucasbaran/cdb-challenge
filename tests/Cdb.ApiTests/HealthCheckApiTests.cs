namespace Cdb.ApiTests;

using System.Net;
using FluentAssertions;
using Xunit;

public class HealthCheckApiTests : IClassFixture<ApiTestFactory>
{
    private readonly ApiTestFactory _factory;
    private readonly HttpClient _client;

    public HealthCheckApiTests(ApiTestFactory factory)
    {
        _factory = factory;
        _client = factory.Client;
    }

    [Fact]
    public async Task GET_health_Returns200()
    {
        var response = await _client.GetAsync("/health");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}