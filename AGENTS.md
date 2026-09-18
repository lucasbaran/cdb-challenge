# CDB Challenge - AI Development Instructions

## Objetivo

Este projeto é uma solução técnica para cálculo de investimento em CDB. Deve demonstrar análise, SOLID, Clean Architecture, testes, performance, escalabilidade, observabilidade, qualidade de API e frontend.

A solução deve ser simples, objetiva e tecnicamente justificável.

## Fonte de verdade

Antes de implementar qualquer funcionalidade, consulte:

1. `docs/challenge.md`
2. `docs/architecture.md`
3. `rules/backend.md`
4. `rules/frontend.md`
5. `rules/testing.md`
6. `rules/quality.md`

O requisito original do desafio tem prioridade sobre decisões arquiteturais.

Nunca invente requisitos funcionais. Em caso de ambiguidade, identifique-a, escolha a interpretação mais simples e defensável e documente a decisão.

## Stack

Backend:
- .NET 10
- ASP.NET Core
- Minimal APIs
- Entity Framework Core
- PostgreSQL
- Redis
- FluentValidation
- AutoMapper
- Serilog
- OpenTelemetry
- Asp.Versioning.Http

Frontend:
- Angular 22
- Angular CLI
- TypeScript
- Jest

Testes backend:
- xUnit
- FluentAssertions
- Moq
- AutoFixture
- AutoFixture.AutoMoq

## Arquitetura

Utilizar Clean Architecture:

- Cdb.Api
- Cdb.Application
- Cdb.Domain
- Cdb.Infrastructure

Dependências permitidas:

- Domain não referencia outras camadas.
- Application referencia Domain.
- Infrastructure referencia Application e Domain.
- Api referencia Application e Infrastructure.

Domain não deve depender de ASP.NET Core, EF Core, PostgreSQL, Redis ou detalhes de infraestrutura.

## Regra de domínio

O cálculo financeiro do CDB é regra de negócio. Não deve existir no endpoint, Controller, componente Angular ou DbContext.

O backend é a fonte de verdade para cálculo, rendimento, imposto, valor bruto e valor líquido.

## Dinheiro

Utilizar `decimal` para valores monetários. Nunca utilizar `double` ou `float` para dinheiro. Evitar números mágicos.

## SOLID

Aplicar SOLID de forma pragmática. Não criar interfaces, abstrações ou patterns apenas para aumentar a quantidade de código. Priorizar baixo acoplamento, alta coesão, testabilidade e manutenção.

## CQRS e MediatR

Podem ser utilizados quando trouxerem benefício real. Não utilizar CQRS ou MediatR apenas para aumentar a complexidade.

## API

Utilizar Minimal APIs. Endpoints devem ser finos: receber request, delegar para Application e retornar response. Não conter regra de negócio, cálculo, acesso direto a banco ou Redis.

## API Versioning

Utilizar `Asp.Versioning.Http` e rotas como `/api/v1/...`. Não alterar comportamento de versão publicada.

## OpenAPI

Documentar adequadamente todas as rotas com nome, summary, description, tags e respostas.

## DTOs

Preferir records imutáveis.

## Validação

Utilizar FluentValidation para validação de entrada. Não duplicar validações desnecessariamente em endpoint, service, validator e frontend.

## Testes

Toda regra de negócio deve possuir testes. Backend: Unit, Integration e API Tests. Frontend: Jest. A camada lógica deve possuir cobertura superior a 90%.

## Cálculo

Para cada mês:

`ValorFinal = ValorAtual * (1 + CDI * TB)`

O resultado de um mês é a entrada do mês seguinte. Não substituir por juros simples.

## Imposto

O imposto incide sobre o rendimento:

`Rendimento = ValorFinal - ValorInicial`

Faixas:

- até 6 meses: 22,5%
- até 12 meses: 20%
- até 24 meses: 17,5%
- acima de 24 meses: 15%

## Performance e escalabilidade

Considerar complexidade, allocations, acesso ao banco, chamadas externas, concorrência e escalabilidade horizontal. A aplicação deve ser stateless. Não adicionar tecnologia apenas para demonstrar conhecimento.

## Observabilidade

Utilizar Serilog, OpenTelemetry e Correlation ID. Nunca utilizar `Console.WriteLine()` e não registrar dados sensíveis.

## Qualidade

Antes de concluir:

```bash
dotnet build
dotnet test
dotnet format
```

Verificar warnings, cobertura, duplicação, complexidade, arquitetura, performance, segurança e Sonar.

## Processo obrigatório da IA

Ao receber uma tarefa:

1. entender o requisito;
2. identificar regras, entradas, saídas, erros e edge cases;
3. definir a solução;
4. criar ou atualizar testes;
5. implementar;
6. executar testes;
7. executar build e análise de qualidade;
8. revisar a implementação.

Nunca considerar uma tarefa concluída apenas porque compila.

## Não fazer

Nunca:
- inventar requisitos;
- alterar regras financeiras;
- colocar regra de negócio na API;
- colocar regra financeira no Angular;
- usar double para dinheiro;
- ignorar testes ou warnings;
- criar testes apenas para aumentar coverage;
- criar abstrações sem necessidade;
- adicionar dependências sem justificativa;
- alterar arquitetura importante sem explicar.

## Revisão

Antes de finalizar qualquer funcionalidade, verificar requisito, arquitetura, SOLID, testes, edge cases, performance, segurança, logging e documentação.
