namespace Cdb.ApiTests;

using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.Hosting;
using Xunit;
using Cdb.Api;

public sealed class ApiTestFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    public HttpClient Client { get; private set; } = null!;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
    }

    protected override void ConfigureClient(HttpClient client)
    {
        client.BaseAddress = new Uri("http://localhost/api/v1/");
    }

    public async Task InitializeAsync()
    {
        Client = CreateClient();
        await Task.CompletedTask;
    }

    public new async Task DisposeAsync()
    {
        Client?.Dispose();
        await base.DisposeAsync();
    }
}