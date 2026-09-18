# CDB Challenge

## 1. Objetivo

Desenvolver uma aplicação web para cálculo de investimento em CDB.

A solução deve demonstrar capacidade de análise, implementação, SOLID, testes automatizados e performance.

## 2. Funcionalidade

A aplicação deve permitir informar:

- valor monetário positivo;
- prazo em meses maior que 1.

Após solicitar o cálculo, apresentar:

- resultado bruto;
- resultado líquido.

## 3. API

A API deve receber valor inicial e prazo em meses, executar o cálculo e retornar os resultados necessários.

## 4. Cálculo

Utilizar:

`VF = VI × [1 + (CDI × TB)]`

Onde VI é valor inicial, VF é valor final, CDI é a taxa CDI e TB é o percentual pago pelo banco sobre o CDI.

A fórmula calcula um mês. O resultado de cada mês deve ser utilizado como valor inicial do mês seguinte.

## 5. Valores fixos

- TB = 108% = 1,08
- CDI = 0,9% = 0,009

Taxa mensal resultante:

`0,009 × 1,08 = 0,00972 = 0,972% ao mês`

## 6. Imposto

- até 6 meses: 22,5%
- até 12 meses: 20%
- até 24 meses: 17,5%
- acima de 24 meses: 15%

O imposto incide sobre o rendimento:

`Rendimento bruto = Valor final - Valor inicial`

`Imposto = Rendimento bruto × Alíquota`

`Valor líquido = Valor final - Imposto`

Faixas efetivas:

- 1 a 6 meses → 22,5%
- 7 a 12 meses → 20%
- 13 a 24 meses → 17,5%
- 25 meses ou mais → 15%

## 7. Requisitos técnicos

Backend: o desafio aceita .NET Framework 4.7.2 ou superior; este projeto utilizará .NET 10.

Frontend: Angular CLI; este projeto utilizará Angular 22.

Testes frontend: Jest.

Testes backend: cobertura superior a 90% na camada lógica.

## 8. Qualidade e entrega

Backend e frontend devem estar em uma única solução do Visual Studio. Deve existir documentação para instalação, configuração, execução, testes, arquitetura e decisões relevantes. O projeto deve ser versionado em repositório público no GitHub.

## 9. Fora do escopo

Não implementar autenticação, cadastro de usuários, movimentação bancária, integração real com instituições financeiras, consulta real de CDI, operações de resgate, aportes ou histórico, salvo se uma necessidade técnica for documentada.

CDI e TB são valores fixos conforme este documento.
