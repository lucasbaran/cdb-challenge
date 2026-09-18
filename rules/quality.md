# Code Quality Rules

## Objetivo

Código legível, simples, testável, sustentável, seguro, performático e observável.

## SOLID

Aplicar SRP, OCP, LSP, ISP e DIP quando realmente melhorarem a solução. Evitar abstrações especulativas.

## Simplicidade

Preferir código simples a arquitetura complexa.

## Overengineering

Evitar Generic Repository, UnitOfWork artificial, Factory para um único objeto, Strategy para uma única implementação, CQRS para CRUD simples e múltiplas camadas sem responsabilidade real.

## Performance

Para cálculo de N meses, manter complexidade O(n). Evitar estruturas complexas sem justificativa.

## Memory

Evitar coleções, cópias, strings intermediárias, estado global e caches sem política adequada.

## Scalability

API stateless. Não usar static mutable state.

## Financial correctness

Valores financeiros usam decimal. Nunca double/float.

## Magic numbers

Não espalhar 0.009, 1.08, 0.225, 0.20, 0.175 e 0.15. Dar nomes claros e centralizar.

## Configuration

Centralizar connection strings, CDI, TB, tax rates e URLs. Nunca versionar secrets.

## Error handling

Não retornar 500 para erros previsíveis de validação. Utilizar ProblemDetails ou resposta consistente.

## Logging

Usar structured logging e contexto. Não registrar informações sensíveis.

## Correlation

Utilizar X-Correlation-Id.

## Observability

OpenTelemetry para traces/metrics e instrumentação aplicável.

## Sonar

Corrigir bugs, smells relevantes, vulnerabilidades, duplicações e complexidade. Não ignorar regra apenas para passar pipeline; documentar exceções justificadas.

## Warnings

Não finalizar com warnings relevantes sem justificativa.

## Nullable

Manter nullable reference types habilitado. Evitar `null!` e supressões para esconder problemas.

## Exceptions

Capturar apenas quando houver tratamento, transformação, registro ou recuperação.

## Dependencies

Antes de adicionar pacote, avaliar necessidade, alternativa da plataforma, manutenção, impacto e vulnerabilidades.

## Documentation

Documentar execução, testes, arquitetura, decisões e limitações.

## Git

Preferir commits pequenos e relacionados a uma mudança lógica.

## Definition of Done

- [ ] requisito atendido
- [ ] build
- [ ] testes
- [ ] cobertura adequada
- [ ] edge cases
- [ ] arquitetura
- [ ] SOLID
- [ ] sem warnings relevantes
- [ ] sem problemas Sonar relevantes
- [ ] documentação
- [ ] performance analisada
- [ ] segurança analisada
