import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function positiveNumberValidator(min: number = 0.01): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const num = Number(value);
    return num >= min ? null : { positiveNumber: { min, actual: num } };
  };
}

export function minIntegerValidator(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const num = Number(value);
    return Number.isInteger(num) && num >= min ? null : { minInteger: { min, actual: num } };
  };
}