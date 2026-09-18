import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyPtBr',
  standalone: true
})
export class CurrencyPtBrPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) {
      return 'R$ 0,00';
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
}