import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-p-dropdown',
  standalone: true,
  imports: [SelectModule, FormsModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PDropdownComponent),
    multi: true,
  }],
  template: `
    <p-select
      [inputId]="inputId"
      [attr.aria-label]="ariaLabel || null"
      [options]="options"
      [ngModel]="value"
      [placeholder]="placeholder"
      [optionLabel]="optionLabel || undefined"
      [optionValue]="optionValue || undefined"
      [showClear]="showClear"
      [disabled]="disabled"
      (ngModelChange)="onValueChange($event)"
      (onBlur)="onTouched()"
      [style]="{ width: '100%' }">
    </p-select>
  `,
})
export class PDropdownComponent implements ControlValueAccessor {
  @Input() inputId = '';
  @Input() ariaLabel = '';
  @Input() options: unknown[] = [];
  @Input() placeholder = '';
  @Input() optionLabel = '';
  @Input() optionValue = '';
  @Input() showClear = false;

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
