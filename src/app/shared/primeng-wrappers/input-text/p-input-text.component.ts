import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-p-input-text',
  standalone: true,
  imports: [InputTextModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PInputTextComponent),
    multi: true,
  }],
  template: `
    <input
      pInputText
      type="text"
      [id]="inputId"
      [attr.aria-label]="ariaLabel || null"
      [value]="value"
      [disabled]="disabled"
      [placeholder]="placeholder"
      (input)="onInput($event)"
      (blur)="onTouched()"
      [style]="{ width: '100%' }" />
  `,
})
export class PInputTextComponent implements ControlValueAccessor {
  @Input() inputId = '';
  @Input() ariaLabel = '';
  @Input() placeholder = '';

  value = '';
  disabled = false;
  onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }
}
