import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormValueControl } from '@angular/forms/signals';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-p-dropdown',
  standalone: true,
  imports: [SelectModule, FormsModule],
  host: { '[attr.id]': 'null' },
  template: `
    <p-select
      [inputId]="id()"
      [attr.aria-label]="ariaLabel() || null"
      [options]="$any(options())"
      [ngModel]="value()"
      [placeholder]="placeholder()"
      [optionLabel]="optionLabel() || undefined"
      [optionValue]="optionValue() || undefined"
      [showClear]="showClear()"
      [disabled]="disabled()"
      (ngModelChange)="value.set($event)"
      (onBlur)="touch.emit()"
      [style]="{ width: '100%' }"
    />
  `,
})
export class PDropdownComponent<T> implements FormValueControl<T | null> {
  readonly id = input('');
  readonly ariaLabel = input('');
  readonly options = input<readonly T[]>([]);
  readonly placeholder = input('');
  readonly optionLabel = input('');
  readonly optionValue = input('');
  readonly showClear = input(false);

  readonly value = model<T | null>(null);
  readonly disabled = input(false);
  readonly touch = output<void>();
}

