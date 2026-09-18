FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Directory.Build.props", "."]
COPY ["CdbChallenge.sln", "."]
COPY ["src/backend/Cdb.Domain/Cdb.Domain.csproj", "src/backend/Cdb.Domain/"]
COPY ["src/backend/Cdb.Application/Cdb.Application.csproj", "src/backend/Cdb.Application/"]
COPY ["src/backend/Cdb.Infrastructure/Cdb.Infrastructure.csproj", "src/backend/Cdb.Infrastructure/"]
COPY ["src/backend/Cdb.Api/Cdb.Api.csproj", "src/backend/Cdb.Api/"]
COPY ["tests/Cdb.UnitTests/Cdb.UnitTests.csproj", "tests/Cdb.UnitTests/"]
COPY ["tests/Cdb.IntegrationTests/Cdb.IntegrationTests.csproj", "tests/Cdb.IntegrationTests/"]
COPY ["tests/Cdb.ApiTests/Cdb.ApiTests.csproj", "tests/Cdb.ApiTests/"]

RUN dotnet restore "CdbChallenge.sln"

COPY ["src/backend/Cdb.Domain/", "src/backend/Cdb.Domain/"]
COPY ["src/backend/Cdb.Application/", "src/backend/Cdb.Application/"]
COPY ["src/backend/Cdb.Infrastructure/", "src/backend/Cdb.Infrastructure/"]
COPY ["src/backend/Cdb.Api/", "src/backend/Cdb.Api/"]
COPY ["tests/Cdb.UnitTests/", "tests/Cdb.UnitTests/"]
COPY ["tests/Cdb.IntegrationTests/", "tests/Cdb.IntegrationTests/"]
COPY ["tests/Cdb.ApiTests/", "tests/Cdb.ApiTests/"]

RUN dotnet publish "src/backend/Cdb.Api/Cdb.Api.csproj" -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    wget \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

ENTRYPOINT ["dotnet", "Cdb.Api.dll"]