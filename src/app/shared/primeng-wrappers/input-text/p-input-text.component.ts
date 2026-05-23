import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-p-input-text',
  standalone: false,
  template: `
    <input
      pInputText
      type="text"
      [id]="id"
      [attr.aria-label]="ariaLabel || null"
      [value]="value"
      [placeholder]="placeholder"
      (input)="onInput($event)"
      [style]="{ width: '100%' }" />
  `
})
export class PInputTextComponent {
  @Input() id = '';
  @Input() ariaLabel = '';
  @Input() value = '';
  @Input() placeholder = '';
  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
