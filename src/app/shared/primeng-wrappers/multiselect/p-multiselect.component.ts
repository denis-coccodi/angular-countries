import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

const DEFAULT_SELECTION_LIMIT = 3;
const DEFAULT_ITEM_SIZE = 45;


@Component({
  selector: 'app-p-multiselect',
  standalone: true,
  imports: [MultiSelectModule, FormsModule],
  template: `
    <p-multiselect
      [inputId]="inputId()"
      [attr.aria-label]="ariaLabel() || null"
      [options]="options()"
      [ngModel]="selectedOptions()"
      (ngModelChange)="selectedOptions.set($event)"
      [selectionLimit]="selectionLimit()"
      [virtualScroll]="virtualScroll()"
      [virtualScrollItemSize]="virtualScrollItemSize()"
      [optionLabel]="optionLabel() || undefined"
      [optionValue]="optionValue() || undefined"
      [placeholder]="placeholder()"
      [showClear]="showClear()"
      [style]="{ width: '100%' }"
      (onChange)="onSelectionChange($event)"
    />
  `,
})
export class PMultiselectComponent<T> {
  inputId = input('');
  ariaLabel = input('');
  options = input<unknown[]>([]);
  placeholder = input('');
  optionLabel = input('');
  optionValue = input('');
  selectedOptions = model<T[]>([]);
  selectionLimit = input(DEFAULT_SELECTION_LIMIT);
  showClear = input(false);
  virtualScrollItemSize = input(DEFAULT_ITEM_SIZE);
  virtualScroll = input(true);
  valueChange = output<T[]>();

  onSelectionChange(event: { value: T[] }): void {
    this.valueChange.emit(event.value);
  }
}
