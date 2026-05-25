import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-p-dropdown',
  standalone: true,
  imports: [SelectModule, FormsModule],
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
      (ngModelChange)="valueChange.emit($event)"
      [style]="{ width: '100%' }">
    </p-select>
  `
})
export class PDropdownComponent {
  @Input() inputId = '';
  @Input() ariaLabel = '';
  @Input() options: any[] = [];
  @Input() value: any;
  @Input() placeholder = '';
  @Input() optionLabel = '';
  @Input() optionValue = '';
  @Input() showClear = false;
  @Output() valueChange = new EventEmitter<any>();
}
