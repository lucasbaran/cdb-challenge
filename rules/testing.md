# Testing Rules

## Objetivo

Testes protegem comportamento. Não criar testes apenas para aumentar coverage.

## Backend test projects

```text
tests/
├── Cdb.UnitTests/
├── Cdb.IntegrationTests/
└── Cdb.ApiTests/
```

## Unit Tests

Cobrir regras de negócio, cálculo, imposto, validators, services e use cases.

## Integration Tests

Quando apropriado utilizar WebApplicationFactory para validar DI, middleware, validators, Application, Infrastructure e serialização.

## API Tests

Validar status HTTP, request, response, validações, ProblemDetails e versionamento.

## Frameworks

xUnit, FluentAssertions, Moq, AutoFixture e AutoFixture.AutoMoq.

## Arrange Act Assert

Todo teste deve seguir Arrange / Act / Assert.

## Naming

Utilizar `Method_Scenario_ExpectedResult`.

Exemplos:

- `Calculate_ValidInvestment_ShouldReturnGrossValue`
- `Calculate_ValidInvestment_ShouldReturnNetValue`
- `Calculate_ZeroInitialValue_ShouldReturnValidationError`
- `Calculate_InvalidTerm_ShouldReturnValidationError`
- `Calculate_SixMonths_ShouldApply22_5PercentTax`
- `Calculate_SevenMonths_ShouldApply20PercentTax`
- `Calculate_TwelveMonths_ShouldApply20PercentTax`
- `Calculate_ThirteenMonths_ShouldApply17_5PercentTax`
- `Calculate_TwentyFourMonths_ShouldApply17_5PercentTax`
- `Calculate_TwentyFiveMonths_ShouldApply15PercentTax`

## CDB calculation tests

Testar valores positivos, zero, negativos, prazo 1, prazo inválido, prazo válido, um mês, dois meses e múltiplos meses. Verificar composição: resultado do mês N é entrada do mês N+1.

## Tax tests

Testar explicitamente 6/7, 12/13 e 24/25 meses.

## Precision

Testar centavos, valores pequenos, valores grandes, casas decimais e arredondamento.

## Result tests

Validar valor bruto, rendimento, imposto, valor líquido, prazo e valor inicial. Não validar apenas não-nulo.

## Validators

Cada regra de validação relevante deve possuir teste.

## FluentAssertions

Preferir FluentAssertions; evitar Assert.Equal/True/False.

## Mocks

Mockar somente dependências externas. Não mockar entities, value objects, DTOs, collections ou objetos simples.

## Verify

Verificar Times.Once quando a dependência deve ser chamada e Times.Never quando não deve.

## AutoFixture

Utilizar para dados não relevantes ao cenário e Build/With quando propriedades específicas importarem.

## Edge cases

Sempre considerar zero, negativos, menores valores válidos, limites tributários, valores grandes e casas decimais.

## Independência

Testes não dependem de ordem ou estado compartilhado.

## Coverage

Camada lógica deve superar 90%. Coverage não substitui qualidade.

## Não testar

Não criar testes específicos para getters, setters, DTOs, records, mapeamentos triviais ou código sem comportamento.

## Checklist

- [ ] sucesso
- [ ] entrada inválida
- [ ] cada validação
- [ ] cada erro
- [ ] edge cases
- [ ] exceções tratadas
- [ ] integração quando necessário
- [ ] API quando necessário
- [ ] interações relevantes verificadas
- [ ] nomes corretos
- [ ] independência
- [ ] FluentAssertions
- [ ] AutoFixture quando apropriado
- [ ] cobertura > 90%

## Angular

Jest deve testar components, services, formulário, validações, HTTP, sucesso, erro, loading e apresentação do resultado.
