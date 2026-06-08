import { Component, input, model, output } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-p-input-text',
  standalone: true,
  host: { '[attr.id]': 'null' },
  templateUrl: './p-input-text.component.html',
  styleUrl: './p-input-text.component.scss',
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
