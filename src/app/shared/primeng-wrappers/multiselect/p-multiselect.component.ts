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

const DEFAULT_SELECTION_LIMIT = 3;
const DEFAULT_ITEM_SIZE = 45;

let nextId = 0;

@Component({
  selector: 'app-p-multiselect',
  standalone: true,
  imports: [Listbox, Option],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.id]': 'null', class: 'app-multiselect-host' },
  templateUrl: './p-multiselect.component.html',
  styleUrl: './p-multiselect.component.scss',
})
export class PMultiselectComponent<T> implements FormValueControl<T[]> {
  readonly id = input('');
  readonly ariaLabel = input('');
  readonly options = input<readonly T[]>([]);
  readonly placeholder = input('');
  readonly optionLabel = input('');
  readonly optionValue = input('');
  readonly selectionLimit = input(DEFAULT_SELECTION_LIMIT);
  readonly showClear = input(false);
  readonly virtualScrollItemSize = input(DEFAULT_ITEM_SIZE);
  readonly virtualScroll = input(true);

  readonly value = model<T[]>([]);
  readonly disabled = input(false);
  readonly touch = output<void>();

  readonly listboxId = `app-multiselect-listbox-${++nextId}`;
  protected readonly open = signal(false);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly popup = viewChild('listbox', { read: ElementRef });

  private readonly selectedSet = computed(() => new Set(this.value()));
  private readonly limitReached = computed(() => this.value().length >= this.selectionLimit());

  protected isOptionDisabled(opt: T): boolean {
    return this.limitReached() && !this.selectedSet().has(opt);
  }

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
    this.value.set([]);
    this.touch.emit();
  }

  removeItem(item: T, event: Event): void {
    event.stopPropagation();
    this.value.update((items) => items.filter((i) => i !== item));
    this.touch.emit();
  }

  onListboxChange(values: T[]): void {
    const limit = this.selectionLimit();
    const next = values.length > limit ? values.slice(0, limit) : values;
    this.value.set(next);
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
