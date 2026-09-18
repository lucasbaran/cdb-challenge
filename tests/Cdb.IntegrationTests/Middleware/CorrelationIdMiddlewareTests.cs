namespace Cdb.IntegrationTests.Middleware;

using Cdb.IntegrationTests.Fixtures;
using FluentAssertions;
using Xunit;

[Collection("IntegrationTests")]
public class CorrelationIdMiddlewareTests
{
    private readonly WebAppFixture _fixture;

    public CorrelationIdMiddlewareTests(WebAppFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task CorrelationIdMiddleware_PreservesIncomingCorrelationId()
    {
        var correlationId = "incoming-correlation-id-456";
        using var request = new HttpRequestMessage(HttpMethod.Get, "/health");
        request.Headers.Add("X-Correlation-Id", correlationId);

        var response = await _fixture.Client.SendAsync(request);

        response.Headers.Should().ContainKey("X-Correlation-Id");
        response.Headers.GetValues("X-Correlation-Id").First().Should().Be(correlationId);
    }

    [Fact]
    public async Task CorrelationIdMiddleware_GeneratesNewId_WhenNotProvided()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/health");

        var response = await _fixture.Client.SendAsync(request);

        response.Headers.Should().ContainKey("X-Correlation-Id");
        var returnedId = response.Headers.GetValues("X-Correlation-Id").First();
        returnedId.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task CorrelationIdMiddleware_WorksOnCalculateEndpoint()
    {
        var correlationId = "calculate-test-correlation";
        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/v1/calculate")
        {
            Content = new StringContent(
                """{"initialValue": 1000, "months": 12}""",
                System.Text.Encoding.UTF8,
                "application/json")
        };
        request.Headers.Add("X-Correlation-Id", correlationId);

        var response = await _fixture.Client.SendAsync(request);

        response.Headers.Should().ContainKey("X-Correlation-Id");
        response.Headers.GetValues("X-Correlation-Id").First().Should().Be(correlationId);
    }

    [Fact]
    public async Task CorrelationIdMiddleware_DifferentRequestsHaveDifferentIds_WhenNotProvided()
    {
        using var request1 = new HttpRequestMessage(HttpMethod.Get, "/health");
        using var request2 = new HttpRequestMessage(HttpMethod.Get, "/health");

        var response1 = await _fixture.Client.SendAsync(request1);
        var response2 = await _fixture.Client.SendAsync(request2);

        var id1 = response1.Headers.GetValues("X-Correlation-Id").First();
        var id2 = response2.Headers.GetValues("X-Correlation-Id").First();

        id1.Should().NotBe(id2);
    }
}