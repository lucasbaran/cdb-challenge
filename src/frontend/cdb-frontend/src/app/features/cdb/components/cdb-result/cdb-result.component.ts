import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPtBrPipe } from '@shared/pipes/currency-pt-br.pipe';
import { CalculateCdbResponse } from '../../models';

@Component({
  selector: 'app-cdb-result',
  standalone: true,
  imports: [CommonModule, CurrencyPtBrPipe],
  templateUrl: './cdb-result.component.html',
  styleUrls: ['./cdb-result.component.scss']
})
export class CdbResultComponent {
  @Input() result!: CalculateCdbResponse;

  get taxRatePercent(): string {
    return (this.result.taxRate * 100).toFixed(2).replace('.', ',') + '%';
  }
}