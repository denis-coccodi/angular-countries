import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormValueControl } from '@angular/forms/signals';
import { MultiSelectModule } from 'primeng/multiselect';

const DEFAULT_SELECTION_LIMIT = 3;
const DEFAULT_ITEM_SIZE = 45;

@Component({
  selector: 'app-p-multiselect',
  standalone: true,
  imports: [MultiSelectModule, FormsModule],
  host: { '[attr.id]': 'null' },
  template: `
    <p-multiselect
      [inputId]="id()"
      [attr.aria-label]="ariaLabel() || null"
      [options]="$any(options())"
      [ngModel]="value()"
      (ngModelChange)="value.set($event)"
      (onBlur)="touch.emit()"
      [selectionLimit]="selectionLimit()"
      [virtualScroll]="virtualScroll()"
      [virtualScrollItemSize]="virtualScrollItemSize()"
      [optionLabel]="optionLabel() || undefined"
      [optionValue]="optionValue() || undefined"
      [placeholder]="placeholder()"
      [showClear]="showClear()"
      [disabled]="disabled()"
      [style]="{ width: '100%' }"
    />
  `,
})
export class PMultiselectComponent<T> implements FormValueControl<T[]> {
  readonly id = input('');
  ariaLabel = input('');
  options = input<readonly T[]>([]);
  placeholder = input('');
  optionLabel = input('');
  optionValue = input('');
  selectionLimit = input(DEFAULT_SELECTION_LIMIT);
  showClear = input(false);
  virtualScrollItemSize = input(DEFAULT_ITEM_SIZE);
  virtualScroll = input(true);

  readonly value = model<T[]>([]);
  readonly disabled = input(false);
  readonly touch = output<void>();
}
