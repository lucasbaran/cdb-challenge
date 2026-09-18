# Architecture Decision Document

## 1. Objetivo

Definir uma arquitetura simples, testável, de baixo acoplamento e preparada para manutenção e escalabilidade.

## 2. Clean Architecture

```text
src/
├── Cdb.Api
├── Cdb.Application
├── Cdb.Domain
└── Cdb.Infrastructure
```

## 3. Responsabilidades

### Cdb.Domain

Entidades, value objects, regras de negócio, contratos de domínio e serviços de domínio quando necessários. Não conhece ASP.NET Core, EF Core, PostgreSQL, Redis ou HTTP.

### Cdb.Application

Casos de uso, commands, queries, application services, DTOs, validators e interfaces de infraestrutura. Não conhece detalhes de implementação da infraestrutura.

### Cdb.Infrastructure

EF Core, DbContext, PostgreSQL, Redis, persistência, implementações de interfaces e infraestrutura de observabilidade.

### Cdb.Api

HTTP, endpoints, versionamento, middleware, OpenAPI, DI e configuração. Não contém regra de negócio.

## 4. Fluxo

```text
Angular
   ↓ HTTP
Cdb.Api
   ↓
Cdb.Application
   ↓
Cdb.Domain
   ↓
Resultado
```

## 5. Cálculo

O cálculo deve estar isolado em uma abstração de domínio, por exemplo `ICdbCalculator` e `CdbCalculator`, sem dependência de HTTP, banco, Redis ou Angular.

A separação de `TaxCalculator` é opcional e deve ser adotada apenas se melhorar clareza e testabilidade.

## 6. Precisão financeira

Utilizar `decimal` para valores financeiros. O arredondamento deve ser definido explicitamente e protegido por testes.

## 7. Persistência

O desafio não exige persistência dos cálculos. Não adicionar banco apenas por obrigação arquitetural. Se PostgreSQL for utilizado, documentar a finalidade.

## 8. Redis

Redis não é necessário para o cálculo básico. Só utilizar para uma necessidade real, como cache ou configuração, com justificativa.

## 9. Escalabilidade

O cálculo deve ser stateless, permitindo múltiplas instâncias da API. O algoritmo possui complexidade O(n), onde n é a quantidade de meses.

## 10. API

Utilizar `/api/v1/` e API versioning explícito.

## 11. Error handling

Erros previsíveis de entrada são validações. Exceções representam falhas excepcionais. Preferir ProblemDetails e um mecanismo consistente de resultado.

## 12. Frontend

O Angular valida entrada para UX, chama a API e apresenta o resultado. O frontend não implementa o cálculo oficial.

## 13. Patterns

Strategy, Factory, Result Pattern, CQRS e Mediator só devem ser utilizados quando resolverem um problema real.

## 14. Decisões arquiteturais

Toda mudança relevante deve explicar problema, solução, alternativas e impacto.
