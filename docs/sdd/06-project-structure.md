# Project Structure Specification

## Solution Structure
```
cdb-challenge/
├── src/
│   ├── backend/
│   │   ├── Cdb.Api/
│   │   ├── Cdb.Application/
│   │   ├── Cdb.Domain/
│   │   └── Cdb.Infrastructure/
│   └── frontend/
│       └── cdb-frontend/          # Angular app
├── tests/
│   ├── Cdb.UnitTests/
│   ├── Cdb.IntegrationTests/
│   └── Cdb.ApiTests/
├── sdd/
│   └── specs/
├── docs/
├── CdbChallenge.sln
├── README.md
├── .gitignore
├── Directory.Build.props
├── nuget.config
└── docker-compose.yml (optional)
```

## Backend Project Details

### Cdb.Domain (Class Library)
```
Cdb.Domain/
├── Constants/
│   └── CdbConstants.cs
├── Entities/
│   └── CdbInvestment.cs
├── Interfaces/
│   ├── ICdbCalculator.cs
│   └── ITaxCalculator.cs
├── Services/
│   ├── CdbCalculator.cs
│   └── TaxCalculator.cs
└── Cdb.Domain.csproj
```
- Target: net10.0
- No external dependencies (except System.Runtime)
- Nullable reference types enabled

### Cdb.Application (Class Library)
```
Cdb.Application/
├── DTOs/
│   ├── CalculateCdbRequest.cs
│   └── CalculateCdbResponse.cs
├── UseCases/
│   └── CalculateCdbUseCase.cs
├── Validators/
│   └── CalculateCdbRequestValidator.cs
├── Interfaces/
│   └── ICdbCalculator.cs (from Domain)
├── Mapping/
│   └── CdbMappingProfile.cs (AutoMapper)
└── Cdb.Application.csproj
```
- Target: net10.0
- References: Cdb.Domain
- Packages: FluentValidation, AutoMapper, MediatR (optional)

### Cdb.Infrastructure (Class Library)
```
Cdb.Infrastructure/
├── Observability/
│   ├── LoggingConfiguration.cs
│   ├── OpenTelemetryConfiguration.cs
│   └── CorrelationIdMiddleware.cs
├── HealthChecks/
│   └── HealthCheckConfiguration.cs
├── Extensions/
│   └── ServiceCollectionExtensions.cs
└── Cdb.Infrastructure.csproj
```
- Target: net10.0
- References: Cdb.Application, Cdb.Domain
- Packages: Serilog, OpenTelemetry, AspNetCore.HealthChecks

### Cdb.Api (Web Project)
```
Cdb.Api/
├── Features/
│   └── Cdb/
│       └── Calculate/
│           ├── CalculateCdbEndpoint.cs
│           ├── CalculateCdbRequest.cs (or use Application DTO)
│           └── CalculateCdbResponse.cs
├── Extensions/
│   ├── EndpointExtensions.cs
│   ├── SwaggerExtensions.cs
│   └── WebApplicationExtensions.cs
├── Middleware/
│   └── ErrorHandlingMiddleware.cs
├── Program.cs
├── appsettings.json
├── appsettings.Development.json
└── Cdb.Api.csproj
```
- Target: net10.0
- References: Cdb.Application, Cdb.Infrastructure
- Packages: Asp.Versioning.Http, Swashbuckle.AspNetCore, FluentValidation.AspNetCore

## Frontend Project Details

### cdb-frontend (Angular 22)
```
cdb-frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── services/
│   │   │   │   └── api.service.ts
│   │   │   ├── interceptors/
│   │   │   │   └── correlation-id.interceptor.ts
│   │   │   └── models/
│   │   │       └── api-response.model.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── input-field/
│   │   │   │   └── result-card/
│   │   │   ├── pipes/
│   │   │   │   └── currency-pt-br.pipe.ts
│   │   │   └── validators/
│   │   │       └── positive-number.validator.ts
│   │   └── features/
│   │       └── cdb/
│   │           ├── pages/
│   │           │   └── calculator/
│   │           ├── components/
│   │           │   ├── cdb-form/
│   │           │   └── cdb-result/
│   │           ├── services/
│   │           │   └── cdb-calculator.service.ts
│   │           └── models/
│   │               ├── calculate-cdb-request.ts
│   │               └── calculate-cdb-response.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.development.ts
│   ├── styles.scss
│   └── main.ts
├── angular.json
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Test Projects

### Cdb.UnitTests
```
Cdb.UnitTests/
├── Domain/
│   ├── CdbCalculatorTests.cs
│   └── TaxCalculatorTests.cs
├── Application/
│   ├── CalculateCdbUseCaseTests.cs
│   └── CalculateCdbRequestValidatorTests.cs
├── Cdb.UnitTests.csproj
```
- References: Cdb.Domain, Cdb.Application
- Packages: xUnit, FluentAssertions, Moq, AutoFixture, AutoFixture.AutoMoq

### Cdb.IntegrationTests
```
Cdb.IntegrationTests/
├── Fixtures/
│   └── WebAppFixture.cs
├── Endpoints/
│   └── CalculateCdbEndpointTests.cs
├── Middleware/
│   └── CorrelationIdMiddlewareTests.cs
├── Cdb.IntegrationTests.csproj
```
- References: Cdb.Api, Cdb.Application, Cdb.Domain, Cdb.Infrastructure
- Packages: Microsoft.AspNetCore.Mvc.Testing, xUnit, FluentAssertions

### Cdb.ApiTests
```
Cdb.ApiTests/
├── CalculateCdbApiTests.cs
├── HealthCheckApiTests.cs
├── Cdb.ApiTests.csproj
```
- References: Cdb.Api (via WebApplicationFactory)
- Packages: Microsoft.AspNetCore.Mvc.Testing, xUnit, FluentAssertions

## Shared Configuration

### Directory.Build.props
```xml
<Project>
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
    <GenerateDocumentationFile>true</GenerateDocumentationFile>
  </PropertyGroup>
</Project>
```

### nuget.config
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <clear />
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
  </packageSources>
</configuration>
```

## Build Commands
```bash
# Restore
dotnet restore

# Build
dotnet build

# Test
dotnet test

# Format
dotnet format

# Run API
dotnet run --project src/backend/Cdb.Api

# Run Frontend
cd src/frontend/cdb-frontend && npm start
```