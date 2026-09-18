namespace Cdb.IntegrationTests.Fixtures;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Hosting;
using Xunit;
using Cdb.Api;

public sealed class WebAppFixture : WebApplicationFactory<Program>, IAsyncLifetime
{
    public HttpClient Client { get; private set; } = null!;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
        });

        builder.UseEnvironment("Testing");
    }

    protected override IHost CreateHost(IHostBuilder builder)
    {
        var host = base.CreateHost(builder);
        return host;
    }

    protected override void ConfigureClient(HttpClient client)
    {
        client.BaseAddress = new Uri("http://localhost");
    }

    public async Task InitializeAsync()
    {
        Client = CreateClient();
        Client.BaseAddress = new Uri("http://localhost/api/v1/");
        await Task.CompletedTask;
    }

    public new async Task DisposeAsync()
    {
        Client?.Dispose();
        await base.DisposeAsync();
    }
}

[CollectionDefinition("IntegrationTests")]
public class IntegrationTestCollection : ICollectionFixture<WebAppFixture>
{
}