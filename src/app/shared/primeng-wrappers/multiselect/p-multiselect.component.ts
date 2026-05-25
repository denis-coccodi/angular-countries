import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

const DEFAULT_SELECTION_LIMIT = 3;
const DEFAULT_ITEM_SIZE = 45;

@Component({
  selector: 'app-p-multiselect',
  standalone: true,
  imports: [MultiSelectModule, FormsModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PMultiselectComponent),
    multi: true,
  }],
  template: `
    <p-multiselect
      [inputId]="inputId()"
      [attr.aria-label]="ariaLabel() || null"
      [options]="options()"
      [ngModel]="value"
      (ngModelChange)="onValueChange($event)"
      [selectionLimit]="selectionLimit()"
      [virtualScroll]="virtualScroll()"
      [virtualScrollItemSize]="virtualScrollItemSize()"
      [optionLabel]="optionLabel() || undefined"
      [optionValue]="optionValue() || undefined"
      [placeholder]="placeholder()"
      [showClear]="showClear()"
      [disabled]="disabled"
      [style]="{ width: '100%' }"
    />
  `,
})
export class PMultiselectComponent<T> implements ControlValueAccessor {
  inputId = input('');
  ariaLabel = input('');
  options = input<unknown[]>([]);
  placeholder = input('');
  optionLabel = input('');
  optionValue = input('');
  selectionLimit = input(DEFAULT_SELECTION_LIMIT);
  showClear = input(false);
  virtualScrollItemSize = input(DEFAULT_ITEM_SIZE);
  virtualScroll = input(true);

  value: T[] = [];
  disabled = false;
  onChange: (v: T[]) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: T[]): void {
    this.value = value ?? [];
  }

  registerOnChange(fn: (v: T[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onValueChange(value: T[]): void {
    this.value = value;
    this.onChange(value);
  }
}
