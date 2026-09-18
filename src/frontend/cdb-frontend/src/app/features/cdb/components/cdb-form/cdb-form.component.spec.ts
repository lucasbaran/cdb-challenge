import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CdbFormComponent } from './cdb-form.component';
import { By } from '@angular/platform-browser';
import { positiveNumberValidator, minIntegerValidator } from '@shared/validators/positive-number.validator';

describe('CdbFormComponent', () => {
  let component: CdbFormComponent;
  let fixture: ComponentFixture<CdbFormComponent>;
  let submitFormSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CdbFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CdbFormComponent);
    component = fixture.componentInstance;
    submitFormSpy = jest.spyOn(component.submitForm, 'emit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have form with initialValue and months controls', () => {
    expect(component.form.contains('initialValue')).toBe(true);
    expect(component.form.contains('months')).toBe(true);
  });

  it('should have required validators on both fields', () => {
    const initialValueControl = component.form.get('initialValue');
    const monthsControl = component.form.get('months');

    expect(initialValueControl?.hasError('required')).toBe(true);
    expect(monthsControl?.hasError('required')).toBe(true);
  });

  it('should invalidate initialValue when value is zero or negative', () => {
    const control = component.form.get('initialValue');
    control?.setValue(0);
    expect(control?.hasError('positiveNumber')).toBe(true);

    control?.setValue(-100);
    expect(control?.hasError('positiveNumber')).toBe(true);
  });

  it('should validate initialValue when value is positive', () => {
    const control = component.form.get('initialValue');
    control?.setValue(1000);
    expect(control?.hasError('positiveNumber')).toBe(false);
  });

  it('should invalidate months when value is 1 or less', () => {
    const control = component.form.get('months');
    control?.setValue(1);
    expect(control?.hasError('minInteger')).toBe(true);

    control?.setValue(0);
    expect(control?.hasError('minInteger')).toBe(true);

    control?.setValue(-5);
    expect(control?.hasError('minInteger')).toBe(true);
  });

  it('should validate months when value is 2 or greater', () => {
    const control = component.form.get('months');
    control?.setValue(2);
    expect(control?.hasError('minInteger')).toBe(false);

    control?.setValue(12);
    expect(control?.hasError('minInteger')).toBe(false);
  });

  it('should emit submitForm event when form is valid and submitted', () => {
    component.form.setValue({ initialValue: 1000, months: 12 });
    component.onSubmit();

    expect(submitFormSpy).toHaveBeenCalledWith({ initialValue: 1000, months: 12 });
  });

  it('should not emit submitForm event when form is invalid', () => {
    component.form.setValue({ initialValue: 0, months: 1 });
    component.onSubmit();

    expect(submitFormSpy).not.toHaveBeenCalled();
  });

  it('should set submitted to true on submit', () => {
    component.onSubmit();
    expect(component.submitted).toBe(true);
  });

  it('should reset form and submitted flag', () => {
    component.form.setValue({ initialValue: 1000, months: 12 });
    component.onSubmit();
    component.reset();

    expect(component.form.get('initialValue')?.value).toBeNull();
    expect(component.form.get('months')?.value).toBeNull();
    expect(component.submitted).toBe(false);
  });

  it('should not emit when form values are null after validation', () => {
    component.form.get('initialValue')?.setValue(1000);
    component.form.get('months')?.setValue(12);
    component.form.get('initialValue')?.setValue(null);
    
    component.onSubmit();

    expect(submitFormSpy).not.toHaveBeenCalled();
  });

  it('should display error message for required initialValue when submitted', () => {
    component.form.get('initialValue')?.markAsTouched();
    component.submitted = true;
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toContain('Valor inicial é obrigatório');
  });

  it('should display error message for required months when submitted', () => {
    component.form.get('months')?.markAsTouched();
    component.submitted = true;
    fixture.detectChanges();

    const errorElements = fixture.debugElement.queryAll(By.css('.error-message'));
    const monthsError = errorElements.find((el: { nativeElement: { textContent: string } }) => el.nativeElement.textContent.includes('Prazo'));
    expect(monthsError).toBeTruthy();
  });

  it('should disable submit button when form is invalid', () => {
    component.form.setValue({ initialValue: 0, months: 1 });
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.disabled).toBe(true);
  });

  it('should enable submit button when form is valid', () => {
    component.form.setValue({ initialValue: 1000, months: 12 });
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.disabled).toBe(false);
  });
});