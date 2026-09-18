# CDB Challenge

Aplicação web para cálculo de investimento em CDB (Certificado de Depósito Bancário).

## Visão Geral

Esta solução implementa uma aplicação completa para cálculo de investimento em CDB, demonstrando:
- **Clean Architecture** com separação clara de responsabilidades
- **Domain-Driven Design** com regras de negócio isoladas no domínio
- **Minimal APIs** no ASP.NET Core 10
- **Angular 22** no frontend
- **Testes automatizados** (Unit, Integration, API) com cobertura > 90%
- **Observabilidade** com Serilog, OpenTelemetry e Correlation ID
- **API Versioning** explícito
- **Docker** para deploy

## Arquitetura

```
src/
├── backend/
│   ├── Cdb.Api              # Minimal APIs, endpoints, middleware, OpenAPI
│   ├── Cdb.Application      # Use cases, DTOs, validators, FluentValidation
│   ├── Cdb.Domain           # Entidades, value objects, regras de negócio, calculadoras
│   └── Cdb.Infrastructure   # Observabilidade, health checks, DI extensions
└── frontend/
    └── cdb-frontend         # Angular 22 application (standalone components)

tests/
├── Cdb.UnitTests            # Testes de unidade (Domain + Application)
├── Cdb.IntegrationTests     # Testes de integração (WebApplicationFactory)
└── Cdb.ApiTests             # Testes de API (HTTP, status codes, ProblemDetails)
```

### Fluxo de Dados

```
Angular (Frontend)
    ↓ HTTP (POST /api/v1/cdb/calculate)
Cdb.Api (Minimal API Endpoint)
    ↓ Delegation
Cdb.Application (CalculateCdbUseCase + Validator)
    ↓ Domain Services
Cdb.Domain (CdbCalculator + TaxCalculator)
    ↓ Result
Cdb.Application (DTO Response)
    ↓ Serialization
Cdb.Api (HTTP Response)
    ↓ JSON
Angular (Exibição)
```

## Requisitos

### Backend
- **.NET 10 SDK**
- Docker (opcional, para containerização)

### Frontend
- **Node.js 20+**
- **Angular CLI 22** (`npm install -g @angular/cli@22`)

## Executando Localmente

### Backend

```bash
# Restaurar dependências
dotnet restore

# Build
dotnet build

# Executar testes
dotnet test

# Executar API (Development)
dotnet run --project src/backend/Cdb.Api
```

A API estará disponível em:
- **HTTP**: `http://localhost:5000`
- **Swagger/OpenAPI**: `http://localhost:5000/swagger` (apenas Development)
- **Health Check**: `http://localhost:5000/health`

### Frontend

```bash
cd src/frontend/cdb-frontend

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm start
```

A aplicação estará disponível em `http://localhost:4200`.

## Executando com Docker

### Docker Compose (Recomendado - Backend + Frontend)

```bash
# Build e subir containers
docker-compose up --build

# Em background
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

Serviços disponíveis:
- **Frontend**: `http://localhost:80` (nginx servindo Angular build)
- **Backend**: `http://localhost:8080` (API direta)
- **Health Check Backend**: `http://localhost:8080/health`

### Apenas Backend

```bash
cd src/backend
docker build -t cdb-backend -f Dockerfile ../..
docker run -p 8080:8080 cdb-backend
```

### Apenas Frontend

```bash
cd src/frontend/cdb-frontend
docker build -t cdb-frontend -f Dockerfile ../..
docker run -p 80:80 cdb-frontend
```

## API Endpoints

### Calcular Investimento CDB

```http
POST /api/v1/cdb/calculate
Content-Type: application/json

{
  "initialValue": 1000,
  "months": 12
}
```

**Response (200 OK):**
```json
{
  "initialValue": 1000,
  "months": 12,
  "grossValue": 1123.09,
  "grossProfit": 123.09,
  "taxRate": 0.20,
  "tax": 24.62,
  "netValue": 1098.47
}
```

**Validações (400 Bad Request):**
- `initialValue`: obrigatório, maior que zero
- `months`: obrigatório, inteiro maior que 1

**Exemplo com curl:**
```bash
curl -X POST http://localhost:5000/api/v1/cdb/calculate \
  -H "Content-Type: application/json" \
  -d '{"initialValue": 1000, "months": 12}'
```

### Health Check

```http
GET /health
```

**Response (200 OK):**
```json
{
  "status": "Healthy",
  "checks": [...]
}
```

### Documentação OpenAPI

Disponível apenas em ambiente **Development**:
- Swagger UI: `http://localhost:5000/swagger`
- OpenAPI JSON: `http://localhost:5000/openapi/v1.json`

## Regras de Negócio

### Cálculo do CDB

**Taxas Fixas:**
- **CDI**: 0,9% ao mês (0.009)
- **TB (Taxa do Banco)**: 108% do CDI (1.08)
- **Taxa Mensal Efetiva**: 0,009 × 1,08 = 0,00972 = **0,972% ao mês**

**Fórmula (Juros Compostos):**
```
VF = VI × (1 + taxa_mensal)
```
O resultado de cada mês é utilizado como valor inicial do mês seguinte.

### Imposto de Renda (Tabela Regressiva)

| Prazo | Alíquota |
|-------|----------|
| 1 a 6 meses | 22,5% |
| 7 a 12 meses | 20% |
| 13 a 24 meses | 17,5% |
| 25+ meses | 15% |

**Cálculo do Imposto:**
```
Rendimento Bruto = Valor Final - Valor Inicial
Imposto = Rendimento Bruto × Alíquota
Valor Líquido = Valor Final - Imposto
```

**Observação:** O imposto incide **apenas sobre o rendimento**, não sobre o valor total.

## Testes

### Backend

```bash
# Todos os testes
dotnet test

# Apenas testes de unidade
dotnet test tests/Cdb.UnitTests

# Apenas testes de API
dotnet test tests/Cdb.ApiTests

# Com cobertura de código
dotnet test --collect:"XPlat Code Coverage"

# Relatório de cobertura (requer reportgenerator)
dotnet tool install -g dotnet-reportgenerator-globaltool
reportgenerator -reports:"**/coverage.cobertura.xml" -targetdir:"coveragereport" -reporttypes:Html
```

### Frontend

```bash
cd src/frontend/cdb-frontend

# Executar testes (Jest)
npm test

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo watch
npm run test:watch
```

### Estrutura de Testes Backend

| Projeto | Foco | Frameworks |
|---------|------|------------|
| `Cdb.UnitTests` | Domain Services, Use Cases, Validators | xUnit, FluentAssertions, Moq, AutoFixture |
| `Cdb.IntegrationTests` | DI, Middleware, Pipeline, Serialization | WebApplicationFactory |
| `Cdb.ApiTests` | HTTP Status, Request/Response, Versioning, ProblemDetails | WebApplicationFactory |

**Cobertura Mínima:** 90% na camada lógica (Domain + Application)

## Qualidade de Código

```bash
# Formatar código (dotnet format)
dotnet format

# Build com warnings as errors
dotnet build

# Verificar warnings detalhados
dotnet build --verbosity normal

# Analisar código (requer SonarScanner)
dotnet sonarscanner begin /k:"cdb-challenge" /d:sonar.host.url=http://localhost:9000
dotnet build
dotnet test
dotnet sonarscanner end
```

## Configuração

### Variáveis de Ambiente (Backend)

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `ASPNETCORE_ENVIRONMENT` | `Development` | Ambiente (Development/Production) |
| `ASPNETCORE_URLS` | `http://+:5000` | URLs de binding |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | - | Endpoint OpenTelemetry Collector |
| `CDB_CDI_RATE` | `0.009` | Taxa CDI (override) |
| `CDB_TB_RATE` | `1.08` | Taxa TB (override) |

### Configuração Frontend

Arquivos em `src/frontend/cdb-frontend/src/environments/`:
- `environment.ts` - Produção
- `environment.development.ts` - Desenvolvimento

```typescript
export const environment = {
  apiUrl: 'http://localhost:5000/api/v1'
};
```

## Observabilidade

### Logging (Serilog)
- Logs estruturados em JSON
- Níveis: Debug, Information, Warning, Error, Critical
- Correlation ID em todos os logs

### OpenTelemetry
- Traces HTTP (ASP.NET Core)
- Métricas de aplicação
- Exportação OTLP (configurável)

### Correlation ID
- Header: `X-Correlation-Id`
- Gerado automaticamente se não fornecido
- Propagado em logs e traces

### Health Checks
- Endpoint: `/health`
- Verifica: API, dependências configuradas

## Decisões Arquiteturais

| Decisão | Justificativa |
|---------|---------------|
| **Clean Architecture** | Separação de responsabilidades, testabilidade, manutenibilidade |
| **Domain-Driven** | Regras financeiras isoladas, sem dependências de infraestrutura |
| **Minimal APIs** | Endpoints finos, performance, simplicidade |
| **decimal para dinheiro** | Precisão financeira, evita erros de ponto flutuante |
| **FluentValidation** | Validação declarativa, testável, separada do domínio |
| **Serilog + OpenTelemetry** | Observabilidade padrão da indústria |
| **Correlation ID** | Rastreabilidade distribuída |
| **API Versioning** | Evolução segura da API (`/api/v1/`) |
| **Result Pattern** | Tratamento de erros sem exceções para fluxo normal |
| **CQRS/mediator não utilizados** | Complexidade desnecessária para caso de uso simples |

## Estrutura de Pastas Detalhada

### Backend

```
src/backend/
├── Cdb.Api/
│   ├── Endpoints/           # Minimal API endpoints
│   ├── Extensions/          # DI, Pipeline configuration
│   ├── Observability/       # Serilog, OpenTelemetry, CorrelationId
│   └── Program.cs           # Entry point
├── Cdb.Application/
│   ├── DTOs/                # Request/Response records
│   ├── UseCases/            # CalculateCdbUseCase
│   ├── Validators/          # FluentValidation validators
│   └── Interfaces/          # Application service contracts
├── Cdb.Domain/
│   ├── Entities/            # CdbInvestment
│   ├── Services/            # CdbCalculator, TaxCalculator
│   ├── Interfaces/          # ICdbCalculator, ITaxCalculator
│   ├── Constants/           # CdbConstants (tax rates, CDI, TB)
│   └── ValueObjects/        # (se aplicável)
└── Cdb.Infrastructure/
    ├── Extensions/          # DI registration
    └── HealthChecks/        # Custom health checks
```

### Frontend

```
src/frontend/cdb-frontend/src/app/
├── core/                    # Services, interceptors, guards
├── shared/                  # Components, pipes, validators, directives
│   ├── components/
│   ├── pipes/
│   └── validators/
└── features/
    └── cdb/
        ├── pages/           # Calculate page component
        ├── components/      # Form, result display
        ├── services/        # CdbApiService
        └── models/          # Request/Response interfaces
```

## Fora do Escopo

- ✅ Autenticação/Autorização
- ✅ Persistência de histórico de cálculos
- ✅ Consulta real de CDI (taxa fixa conforme desafio)
- ✅ Cadastro de usuários
- ✅ Múltiplos produtos financeiros
- ✅ Operações de resgate/aportes
- ✅ Notificações

## Troubleshooting

### Porta em uso
```bash
# Verificar porta
netstat -ano | findstr :5000

# Matar processo
taskkill /PID <PID> /F
```

### Erro de certificado HTTPS (Development)
```bash
dotnet dev-certs https --trust
```

### Limpar cache Docker
```bash
docker-compose down -v
docker system prune -f
docker-compose up --build
```

### Frontend não conecta no backend
Verifique `environment.ts` - `apiUrl` deve apontar para o backend correto.

## Licença

MIT

---

**Desenvolvido como solução técnica para o CDB Challenge**  
Demonstrando: Clean Architecture, SOLID, Testes, Observabilidade, Performance, Qualidade de API e Frontend.