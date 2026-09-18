import { FormControl } from '@angular/forms';
import { positiveNumberValidator, minIntegerValidator } from './positive-number.validator';

describe('Validators', () => {
  describe('positiveNumberValidator', () => {
    it('should return null for null value', () => {
      const control = new FormControl(null);
      const validator = positiveNumberValidator(0.01);
      expect(validator(control)).toBeNull();
    });

    it('should return null for undefined value', () => {
      const control = new FormControl(undefined);
      const validator = positiveNumberValidator(0.01);
      expect(validator(control)).toBeNull();
    });

    it('should return null for empty string', () => {
      const control = new FormControl('');
      const validator = positiveNumberValidator(0.01);
      expect(validator(control)).toBeNull();
    });

    it('should return error for zero value', () => {
      const control = new FormControl(0);
      const validator = positiveNumberValidator(0.01);
      const result = validator(control);
      expect(result).toEqual({ positiveNumber: { min: 0.01, actual: 0 } });
    });

    it('should return error for negative value', () => {
      const control = new FormControl(-100);
      const validator = positiveNumberValidator(0.01);
      const result = validator(control);
      expect(result).toEqual({ positiveNumber: { min: 0.01, actual: -100 } });
    });

    it('should return null for positive value above minimum', () => {
      const control = new FormControl(1000);
      const validator = positiveNumberValidator(0.01);
      expect(validator(control)).toBeNull();
    });

    it('should return null for value equal to minimum', () => {
      const control = new FormControl(0.01);
      const validator = positiveNumberValidator(0.01);
      expect(validator(control)).toBeNull();
    });

    it('should return error for value below minimum', () => {
      const control = new FormControl(0.005);
      const validator = positiveNumberValidator(0.01);
      const result = validator(control);
      expect(result).toEqual({ positiveNumber: { min: 0.01, actual: 0.005 } });
    });

    it('should work with custom minimum', () => {
      const control = new FormControl(5);
      const validator = positiveNumberValidator(10);
      const result = validator(control);
      expect(result).toEqual({ positiveNumber: { min: 10, actual: 5 } });
    });
  });

  describe('minIntegerValidator', () => {
    it('should return null for null value', () => {
      const control = new FormControl(null);
      const validator = minIntegerValidator(2);
      expect(validator(control)).toBeNull();
    });

    it('should return null for undefined value', () => {
      const control = new FormControl(undefined);
      const validator = minIntegerValidator(2);
      expect(validator(control)).toBeNull();
    });

    it('should return null for empty string', () => {
      const control = new FormControl('');
      const validator = minIntegerValidator(2);
      expect(validator(control)).toBeNull();
    });

    it('should return error for value less than minimum', () => {
      const control = new FormControl(1);
      const validator = minIntegerValidator(2);
      const result = validator(control);
      expect(result).toEqual({ minInteger: { min: 2, actual: 1 } });
    });

    it('should return error for zero', () => {
      const control = new FormControl(0);
      const validator = minIntegerValidator(2);
      const result = validator(control);
      expect(result).toEqual({ minInteger: { min: 2, actual: 0 } });
    });

    it('should return error for negative value', () => {
      const control = new FormControl(-5);
      const validator = minIntegerValidator(2);
      const result = validator(control);
      expect(result).toEqual({ minInteger: { min: 2, actual: -5 } });
    });

    it('should return error for non-integer value', () => {
      const control = new FormControl(2.5);
      const validator = minIntegerValidator(2);
      const result = validator(control);
      expect(result).toEqual({ minInteger: { min: 2, actual: 2.5 } });
    });

    it('should return null for valid integer at minimum', () => {
      const control = new FormControl(2);
      const validator = minIntegerValidator(2);
      expect(validator(control)).toBeNull();
    });

    it('should return null for valid integer above minimum', () => {
      const control = new FormControl(12);
      const validator = minIntegerValidator(2);
      expect(validator(control)).toBeNull();
    });

    it('should return null for valid integer at 60 months', () => {
      const control = new FormControl(60);
      const validator = minIntegerValidator(2);
      expect(validator(control)).toBeNull();
    });
  });
});