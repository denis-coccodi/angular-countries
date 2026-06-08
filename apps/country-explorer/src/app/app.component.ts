import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PHeaderComponent } from '@country-explorer/ui-kit';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, PHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Country Explorer';

  constructor() {
    const doc = inject(DOCUMENT);
    // Track pointer vs keyboard focus. Browsers always set :focus-visible on text
    // inputs even on click, so CSS alone can't distinguish for PrimeNG components.
    doc.addEventListener('pointerdown', () => doc.body.setAttribute('data-pointer-focus', ''));
    doc.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Tab') doc.body.removeAttribute('data-pointer-focus');
    });
  }
}
