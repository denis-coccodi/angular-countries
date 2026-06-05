import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { Listbox, Option } from '@angular/aria/listbox';

let nextId = 0;

@Component({
  selector: 'app-p-dropdown',
  standalone: true,
  imports: [Listbox, Option],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.id]': 'null', class: 'app-dropdown-host' },
  templateUrl: './p-dropdown.component.html',
  styleUrl: './p-dropdown.component.scss',
})
export class PDropdownComponent<T> implements FormValueControl<T | null> {
  readonly id = input('');
  readonly ariaLabel = input('');
  readonly options = input<readonly T[]>([]);
  readonly placeholder = input('');
  readonly optionLabel = input('');
  readonly showClear = input(false);

  readonly value = model<T | null>(null);
  readonly disabled = input(false);
  readonly touch = output<void>();

  readonly listboxId = `app-dropdown-listbox-${++nextId}`;
  protected readonly open = signal(false);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly popup = viewChild('listbox', { read: ElementRef });

  protected readonly hasValue = computed(() => {
    const v = this.value();
    return v != null && v !== '';
  });

  protected readonly selectedValues = computed<T[]>(() => {
    const v = this.value();
    return this.hasValue() ? [v as T] : [];
  });

  protected readonly displayText = computed(() => {
    if (!this.hasValue()) return this.placeholder();
    return this.labelFor(this.value() as T);
  });

  labelFor(opt: T): string {
    const path = this.optionLabel();
    if (!path) return String(opt ?? '');
    const value = path.split('.').reduce<unknown>((acc, key) => {
      if (acc == null || typeof acc !== 'object') return undefined;
      return (acc as Record<string, unknown>)[key];
    }, opt as unknown);
    return value == null ? '' : String(value);
  }

  private focusListbox(): void {
    setTimeout(() => this.popup()?.nativeElement?.focus(), 0);
  }

  private focusTrigger(): void {
    queueMicrotask(() => this.trigger()?.nativeElement?.focus());
  }

  toggle(): void {
    if (this.disabled()) return;
    const willOpen = !this.open();
    this.open.set(willOpen);
    if (willOpen) this.focusListbox();
  }

  close(returnFocus = false): void {
    if (this.open()) {
      this.open.set(false);
      if (returnFocus) this.focusTrigger();
      this.touch.emit();
    }
  }

  clear(event: Event): void {
    event.stopPropagation();
    this.value.set(null);
    this.close(true);
  }

  onListboxChange(values: T[]): void {
    const next = values.length ? values[values.length - 1] : null;
    this.value.set(next);
    this.open.set(false);
    this.focusTrigger();
    this.touch.emit();
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.open()) {
      event.preventDefault();
      this.close(true);
      return;
    }
    if (!this.open() && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.open.set(true);
      this.focusListbox();
    }
  }

  onListboxKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close(true);
    }
  }

  onTriggerBlur(): void {
    if (!this.open()) this.touch.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.open()) return;
    if (this.hostRef.nativeElement.contains(event.target as Node)) return;
    this.close();
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event: FocusEvent): void {
    if (!this.open()) return;
    const next = event.relatedTarget as Node | null;
    if (next && this.hostRef.nativeElement.contains(next)) return;
    this.close();
  }
}
