import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-p-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './p-header.component.scss',
  template: `
    <header class="app-header">
      <div class="header-content">
        <div class="header-title">
          <i class="pi pi-globe" aria-hidden="true"></i>
          <span>{{ title() }}</span>
        </div>
        <nav class="header-nav" aria-label="Main navigation">
          <a routerLink="/countries" routerLinkActive="active">Countries</a>
          <a routerLink="/compare" routerLinkActive="active">Compare Countries</a>
        </nav>
      </div>
    </header>
  `
})
export class PHeaderComponent {
  readonly title = input('');
}
