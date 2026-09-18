namespace Cdb.IntegrationTests.Endpoints;

using System.Net;
using System.Text.Json;
using Cdb.Application.DTOs;
using Cdb.IntegrationTests.Fixtures;
using FluentAssertions;
using Xunit;

[Collection("IntegrationTests")]
public class CalculateCdbEndpointTests
{
    private readonly WebAppFixture _fixture;
    private readonly JsonSerializerOptions _jsonOptions;

    public CalculateCdbEndpointTests(WebAppFixture fixture)
    {
        _fixture = fixture;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
    }

    [Fact]
    public async Task POST_cdb_calculate_ValidRequest_Returns200WithCorrectResponse()
    {
        var request = new CalculateCdbRequest(1000m, 12);
        var json = JsonSerializer.Serialize(request);

        var response = await _fixture.Client.PostAsync("/api/v1/calculate",
            new StringContent(json, System.Text.Encoding.UTF8, "application/json"));

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Content.Headers.ContentType?.MediaType.Should().Be("application/json");

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<CalculateCdbResponse>(content, _jsonOptions);

        result.Should().NotBeNull();
        result!.InitialValue.Should().Be(1000m);
        result.Months.Should().Be(12);
        result.GrossValue.Should().BeGreaterThan(1000m);
        result.GrossProfit.Should().Be(result.GrossValue - 1000m);
        result.TaxRate.Should().Be(0.20m);
        result.Tax.Should().Be(result.GrossProfit * 0.20m);
        result.NetValue.Should().Be(result.GrossValue - result.Tax);
    }

    [Fact]
    public async Task POST_cdb_calculate_ZeroInitialValue_Returns400()
    {
        var request = new CalculateCdbRequest(0m, 12);
        var json = JsonSerializer.Serialize(request);

        var response = await _fixture.Client.PostAsync("/api/v1/calculate",
            new StringContent(json, System.Text.Encoding.UTF8, "application/json"));

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        response.Content.Headers.ContentType?.MediaType.Should().Be("application/problem+json");

        var content = await response.Content.ReadAsStringAsync();
        var problemDetails = JsonSerializer.Deserialize<JsonElement>(content);
        problemDetails.GetProperty("status").GetInt32().Should().Be(400);
        problemDetails.GetProperty("title").GetString().Should().Contain("validation");
    }

    [Fact]
    public async Task POST_cdb_calculate_OneMonth_Returns400()
    {
        var request = new CalculateCdbRequest(1000m, 1);
        var json = JsonSerializer.Serialize(request);

        var response = await _fixture.Client.PostAsync("/api/v1/calculate",
            new StringContent(json, System.Text.Encoding.UTF8, "application/json"));

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task POST_cdb_calculate_MissingFields_Returns400()
    {
        var json = "{}";

        var response = await _fixture.Client.PostAsync("/api/v1/calculate",
            new StringContent(json, System.Text.Encoding.UTF8, "application/json"));

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task POST_cdb_calculate_ReturnsCorrectContentType()
    {
        var request = new CalculateCdbRequest(1000m, 6);
        var json = JsonSerializer.Serialize(request);

        var response = await _fixture.Client.PostAsync("/api/v1/calculate",
            new StringContent(json, System.Text.Encoding.UTF8, "application/json"));

        response.Content.Headers.ContentType?.MediaType.Should().Be("application/json");
    }

    [Fact]
    public async Task POST_cdb_calculate_IncludesCorrelationId()
    {
        var request = new CalculateCdbRequest(1000m, 6);
        var json = JsonSerializer.Serialize(request);

        var correlationId = "test-correlation-id-123";
        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, "/api/v1/cdb/calculate")
        {
            Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json")
        };
        httpRequest.Headers.Add("X-Correlation-Id", correlationId);

        var response = await _fixture.Client.SendAsync(httpRequest);

        response.Headers.Should().ContainKey("X-Correlation-Id");
        response.Headers.GetValues("X-Correlation-Id").First().Should().Be(correlationId);
    }

    [Fact]
    public async Task POST_cdb_calculate_GeneratesCorrelationId_WhenNotProvided()
    {
        var request = new CalculateCdbRequest(1000m, 6);
        var json = JsonSerializer.Serialize(request);

        var response = await _fixture.Client.PostAsync("/api/v1/calculate",
            new StringContent(json, System.Text.Encoding.UTF8, "application/json"));

        response.Headers.Should().ContainKey("X-Correlation-Id");
        response.Headers.GetValues("X-Correlation-Id").First().Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task POST_cdb_calculate_SixMonths_Applies22_5PercentTax()
    {
        var request = new CalculateCdbRequest(1000m, 6);
        var json = JsonSerializer.Serialize(request);

        var response = await _fixture.Client.PostAsync("/api/v1/calculate",
            new StringContent(json, System.Text.Encoding.UTF8, "application/json"));

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<CalculateCdbResponse>(content, _jsonOptions);

        result!.TaxRate.Should().Be(0.225m);
    }

    [Fact]
    public async Task POST_cdb_calculate_ThirteenMonths_Applies17_5PercentTax()
    {
        var request = new CalculateCdbRequest(1000m, 13);
        var json = JsonSerializer.Serialize(request);

        var response = await _fixture.Client.PostAsync("/api/v1/calculate",
            new StringContent(json, System.Text.Encoding.UTF8, "application/json"));

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<CalculateCdbResponse>(content, _jsonOptions);

        result!.TaxRate.Should().Be(0.175m);
    }

    [Fact]
    public async Task POST_cdb_calculate_TwentyFiveMonths_Applies15PercentTax()
    {
        var request = new CalculateCdbRequest(1000m, 25);
        var json = JsonSerializer.Serialize(request);

        var response = await _fixture.Client.PostAsync("/api/v1/calculate",
            new StringContent(json, System.Text.Encoding.UTF8, "application/json"));

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<CalculateCdbResponse>(content, _jsonOptions);

        result!.TaxRate.Should().Be(0.15m);
    }

    [Fact]
    public async Task POST_cdb_calculate_ProblemDetailsFormat_ValidationError()
    {
        var request = new CalculateCdbRequest(-100m, 0);
        var json = JsonSerializer.Serialize(request);

        var response = await _fixture.Client.PostAsync("/api/v1/calculate",
            new StringContent(json, System.Text.Encoding.UTF8, "application/json"));

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var content = await response.Content.ReadAsStringAsync();
        var problemDetails = JsonSerializer.Deserialize<JsonElement>(content, _jsonOptions);

        problemDetails.GetProperty("type").GetString().Should().NotBeNullOrEmpty();
        problemDetails.GetProperty("title").GetString().Should().NotBeNullOrEmpty();
        problemDetails.GetProperty("status").GetInt32().Should().Be(400);
    }
}