import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  positiveNumberValidator,
  minIntegerValidator
} from '../../../../shared/validators/positive-number.validator';

@Component({
  selector: 'app-cdb-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cdb-form.component.html',
  styleUrls: ['./cdb-form.component.scss']
})
export class CdbFormComponent {
  @Output() submitForm = new EventEmitter<{
    initialValue: number;
    months: number;
  }>();

  submitted = false;

  form = this.fb.group({
    initialValue: this.fb.control<number | null>(
      null,
      [Validators.required, positiveNumberValidator(0.01)]
    ),
    months: this.fb.control<number | null>(
      null,
      [Validators.required, minIntegerValidator(2)]
    )
  });

  constructor(private fb: FormBuilder) {}

  get initialValueControl(): FormControl<number | null> {
    return this.form.controls.initialValue;
  }

  get monthsControl(): FormControl<number | null> {
    return this.form.controls.months;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const initialValue = this.initialValueControl.value;
    const months = this.monthsControl.value;

    if (initialValue === null || months === null) {
      return;
    }

    this.submitForm.emit({
      initialValue,
      months
    });
  }

  reset(): void {
    this.form.reset();
    this.submitted = false;
  }
}