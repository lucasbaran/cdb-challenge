namespace Cdb.ApiTests;

using System.Net;
using System.Text.Json;
using FluentAssertions;
using Xunit;

public class CalculateCdbApiTests : IClassFixture<ApiTestFactory>
{
    private readonly ApiTestFactory _factory;
    private readonly HttpClient _client;
    private readonly JsonSerializerOptions _jsonOptions;

    public CalculateCdbApiTests(ApiTestFactory factory)
    {
        _factory = factory;
        _client = factory.Client;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
    }

    [Fact]
    public async Task POST_cdb_calculate_ValidRequest_Returns200()
    {
        var request = new { initialValue = 1000m, months = 12 };
        var json = JsonSerializer.Serialize(request);

        var response = await _client.PostAsync("/api/v1/calculate",
            new StringContent(json, System.Text.Encoding.UTF8, "application/json"));

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Content.Headers.ContentType?.MediaType.Should().Be("application/json");

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<JsonElement>(content, _jsonOptions);

        result.GetProperty("initialValue").GetDecimal().Should().Be(1000m);
        result.GetProperty("months").GetInt32().Should().Be(12);
        result.GetProperty("grossValue").GetDecimal().Should().BeGreaterThan(1000m);
        result.GetProperty("grossProfit").GetDecimal().Should().BeGreaterThan(0);
        result.GetProperty("taxRate").GetDecimal().Should().Be(0.20m);
        result.GetProperty("tax").GetDecimal().Should().BeGreaterThan(0);
        result.GetProperty("netValue").GetDecimal().Should().BeGreaterThan(1000m);
    }

    [Fact]
    public async Task POST_cdb_calculate_ZeroInitialValue_Returns400()
    {
        var request = new { initialValue = 0m, months = 12 };
        var json = JsonSerializer.Serialize(request);

        var response = await _client.PostAsync("/api/v1/calculate",
            new StringContent(json, System.Text.Encoding.UTF8, "application/json"));

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        response.Content.Headers.ContentType?.MediaType.Should().Be("application/problem+json");
    }

    [Fact]
    public async Task POST_cdb_calculate_OneMonth_Returns400()
    {
        var request = new { initialValue = 1000m, months = 1 };
        var json = JsonSerializer.Serialize(request);

        var response = await _client.PostAsync("/api/v1/calculate",
            new StringContent(json, System.Text.Encoding.UTF8, "application/json"));

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task POST_cdb_calculate_MissingFields_Returns400()
    {
        var json = "{}";

        var response = await _client.PostAsync("/api/v1/calculate",
            new StringContent(json, System.Text.Encoding.UTF8, "application/json"));

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task POST_cdb_calculate_ReturnsCorrectContentType()
    {
        var request = new { initialValue = 1000m, months = 6 };
        var json = JsonSerializer.Serialize(request);

        var response = await _client.PostAsync("/api/v1/calculate",
            new StringContent(json, System.Text.Encoding.UTF8, "application/json"));

        response.Content.Headers.ContentType?.MediaType.Should().Be("application/json");
    }

    [Fact]
    public async Task POST_cdb_calculate_IncludesCorrelationId()
    {
        var request = new { initialValue = 1000m, months = 6 };
        var json = JsonSerializer.Serialize(request);

        var correlationId = "test-correlation-id-123";
        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, "/api/v1/calculate")
        {
            Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json")
        };
        httpRequest.Headers.Add("X-Correlation-Id", correlationId);

        var response = await _client.SendAsync(httpRequest);

        response.Headers.Should().ContainKey("X-Correlation-Id");
        response.Headers.GetValues("X-Correlation-Id").First().Should().Be(correlationId);
    }

    [Fact]
    public async Task POST_cdb_calculate_NegativeInitialValue_Returns400()
    {
        var request = new { initialValue = -100m, months = 12 };
        var json = JsonSerializer.Serialize(request);

        var response = await _client.PostAsync("/api/v1/calculate",
            new StringContent(json, System.Text.Encoding.UTF8, "application/json"));

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task POST_cdb_calculate_ZeroMonths_Returns400()
    {
        var request = new { initialValue = 1000m, months = 0 };
        var json = JsonSerializer.Serialize(request);

        var response = await _client.PostAsync("/api/v1/calculate",
            new StringContent(json, System.Text.Encoding.UTF8, "application/json"));

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}