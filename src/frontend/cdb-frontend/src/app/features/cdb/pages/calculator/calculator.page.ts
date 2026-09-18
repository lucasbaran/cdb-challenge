import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

import { CdbFormComponent } from '@features/cdb/components/cdb-form/cdb-form.component';
import { CdbResultComponent } from '@features/cdb/components/cdb-result/cdb-result.component';
import { CdbCalculatorService } from '@features/cdb/services/cdb-calculator.service';
import { CalculateCdbRequest, CalculateCdbResponse } from '@features/cdb/models';

@Component({
  selector: 'app-calculator-page',
  standalone: true,
  imports: [CommonModule, CdbFormComponent, CdbResultComponent],
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss']
})
export class CalculatorPage {
  result: CalculateCdbResponse | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private cdbCalculatorService: CdbCalculatorService,
    private cdr: ChangeDetectorRef
  ) { }

  onCalculate(request: CalculateCdbRequest): void {
    this.loading = true;
    this.error = null;

    this.cdbCalculatorService.calculate(request)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          this.result = response;
        },
        error: (err) => {
          this.error = err.message;
        }
      });
  }

  onNewCalculation(): void {
    this.result = null;
    this.error = null;
  }
}