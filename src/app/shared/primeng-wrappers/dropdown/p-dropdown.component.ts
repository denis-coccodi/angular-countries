import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-p-dropdown',
  standalone: true,
  imports: [SelectModule, FormsModule],
  host: { '[attr.id]': 'null' },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PDropdownComponent),
    multi: true,
  }],
  template: `
    <p-select [inputId]="id()"
      [attr.aria-label]="ariaLabel() || null"
      [options]="options()"
      [ngModel]="value"
      [placeholder]="placeholder()"
      [optionLabel]="optionLabel() || undefined"
      [optionValue]="optionValue() || undefined"
      [showClear]="showClear()"
      [disabled]="disabled"
      (ngModelChange)="onValueChange($event)"
      (onBlur)="onTouched()"
      [style]="{ width: '100%' }" />
  `,
})
export class PDropdownComponent implements ControlValueAccessor {
  readonly id = input('');
  readonly ariaLabel = input('');
  readonly options = input<unknown[]>([]);
  readonly placeholder = input('');
  readonly optionLabel = input('');
  readonly optionValue = input('');
  readonly showClear = input(false);

  value: unknown = null;
  disabled = false;
  onChange: (v: unknown) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: unknown): void {
    this.value = value;
  }

  registerOnChange(fn: (v: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onValueChange(value: unknown): void {
    this.value = value;
    this.onChange(value);
  }
}
