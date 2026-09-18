# Frontend Development Rules

## Stack

- Angular 22
- Angular CLI
- TypeScript
- Jest

## Architecture

Organizar por feature:

```text
src/app/
├── core/
├── shared/
└── features/
    └── cdb/
        ├── pages/
        ├── components/
        ├── services/
        ├── models/
        └── ...
```

## Standalone Components

Utilizar standalone components para novas funcionalidades.

## Components

Cuidar de apresentação, interação, estado visual e formulários. Não conter regras financeiras.

## Backend as source of truth

Não recalcular valor bruto, rendimento, imposto ou valor líquido no frontend.

## Form

Utilizar Reactive Forms. Validar valor obrigatório e positivo e prazo obrigatório e maior que 1. A validação backend continua obrigatória.

## HTTP

Centralizar comunicação em services. Não duplicar chamadas HTTP em componentes.

## Models

Evitar `any`. Criar interfaces/types para requests e responses.

## API URL

Não espalhar URLs hardcoded. Utilizar environment/configuração apropriada.

## Loading e concorrência

Mostrar loading durante requisição e evitar múltiplos submits concorrentes desnecessários.

## Error handling

Apresentar erros de forma amigável, sem stack traces ou detalhes internos.

## Resultados

Apresentar claramente valor inicial, prazo, valor bruto, rendimento, imposto e valor líquido, com formatação pt-BR.

## Accessibility

Utilizar labels, mensagens de erro, navegação por teclado, contraste e HTML semântico.

## Tests

Jest deve cobrir componentes, validações, services, HTTP, sucesso, erro, loading e apresentação do resultado.

## Simplicidade

Não criar state management complexo ou abstrações desnecessárias para uma tela pequena.
