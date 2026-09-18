# Backend Development Rules

## Stack

Utilizar .NET 10, ASP.NET Core, Minimal APIs, EF Core, PostgreSQL, Redis, FluentValidation, AutoMapper, Serilog, OpenTelemetry e Asp.Versioning.Http.

## Naming

PascalCase para classes, métodos e propriedades; camelCase para parâmetros e variáveis; interfaces iniciam com `I`. Métodos assíncronos terminam com `Async`.

## Async

Banco, Redis, HTTP e arquivos devem utilizar async/await quando aplicável. Propagar CancellationToken.

## Minimal API

Não criar Controllers para novas funcionalidades. Endpoints devem ser finos.

## Feature folders

```text
Features/
└── Cdb/
    └── Calculate/
        ├── CalculateCdbEndpoint.cs
        ├── CalculateCdbRequest.cs
        ├── CalculateCdbResponse.cs
        └── CalculateCdbValidator.cs
```

## Endpoints

Receber request, delegar para Application e retornar response. Não calcular, acessar DbContext/Redis ou implementar regra de negócio.

## Endpoint registration

Preferir registro automático de endpoints. Uma interface como `IEndpoint` e Reflection podem ser utilizadas para evitar uma grande lista manual no Program.cs.

## API versioning e OpenAPI

Toda rota possui versão explícita e documentação adequada.

## DTOs

Utilizar records imutáveis.

## FluentValidation

Cada request relevante deve possuir validator. Validações de entrada não devem ficar duplicadas em endpoints e services.

## AutoMapper

Utilizar quando houver benefício real. Profiles separados por feature. Não tornar mapeamentos triviais menos legíveis sem justificativa.

## EF Core

Utilizar AsNoTracking em consultas read-only, CancellationToken, configurações separadas e migrations. Evitar Lazy Loading, N+1 e SaveChanges desnecessários.

## Repository

Não criar Generic Repository apenas para encapsular DbSet. Repository só quando houver comportamento de persistência relevante.

## Financial calculations

Usar `decimal`; nunca `double` ou `float`. Evitar números mágicos. O cálculo deve ficar fora da API.

## Dependency Injection

Utilizar Constructor Injection e lifetimes adequados.

## Logging

Utilizar Serilog e logging estruturado. Nunca Console.WriteLine. Não registrar secrets ou dados sensíveis.

## Correlation ID

Suportar `X-Correlation-Id`; preservar um ID válido recebido ou gerar um novo e incluí-lo no contexto dos logs.

## OpenTelemetry

Instrumentar HTTP, EF Core e Redis quando aplicável, sem misturar observabilidade com regra de negócio.

## Error handling

Não usar exceções para fluxo normal. Preferir Result Pattern/erros estruturados/ProblemDetails.

## Security

Não expor secrets, tokens, connection strings ou detalhes internos. Utilizar environment variables ou mecanismos apropriados.

## Performance e escalabilidade

Evitar loops, allocations, queries e chamadas redundantes. Manter a aplicação stateless e sem estado global mutável.

## Comments

Comentários devem explicar apenas decisões ou limitações não óbvias.
