using Cdb.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApiServices(builder);

var app = builder.Build();

app.ConfigurePipeline();

app.Run();

namespace Cdb.Api
{
    public partial class Program { }
}