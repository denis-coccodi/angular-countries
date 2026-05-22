import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-p-dropdown',
  standalone: false,
  template: `
    <p-select
      [options]="options"
      [ngModel]="value"
      [placeholder]="placeholder"
      [optionLabel]="optionLabel"
      [optionValue]="optionValue"
      [showClear]="showClear"
      (ngModelChange)="valueChange.emit($event)"
      [style]="{ width: '100%' }">
    </p-select>
  `
})
export class PDropdownComponent {
  @Input() options: any[] = [];
  @Input() value: any;
  @Input() placeholder = '';
  @Input() optionLabel = '';
  @Input() optionValue = '';
  @Input() showClear = false;
  @Output() valueChange = new EventEmitter<any>();
}
