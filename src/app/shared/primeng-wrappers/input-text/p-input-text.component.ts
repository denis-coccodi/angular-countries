import { Component, input, model, output } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-p-input-text',
  standalone: true,
  imports: [InputTextModule],
  host: { '[attr.id]': 'null' },
  template: `
    <input
      pInputText
      type="text"
      [id]="id()"
      [attr.aria-label]="ariaLabel() || null"
      [value]="value()"
      [disabled]="disabled()"
      [placeholder]="placeholder()"
      (input)="onInput($event)"
      (blur)="touch.emit()"
      [style]="{ width: '100%' }" />
  `,
})
export class PInputTextComponent implements FormValueControl<string> {
  readonly id = input('');
  readonly ariaLabel = input('');
  readonly placeholder = input('');

  readonly value = model('');
  readonly disabled = input(false);
  readonly touch = output<void>();

  onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
