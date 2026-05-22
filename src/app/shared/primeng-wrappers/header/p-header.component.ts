import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-p-header',
  standalone: false,
  template: `
    <div class="app-header">
      <div class="header-content">
        <div class="header-title">
          <i class="pi pi-globe"></i>
          <span>{{ title }}</span>
        </div>
        <nav class="header-nav">
          <a routerLink="/countries" routerLinkActive="active">Countries</a>
        </nav>
      </div>
    </div>
  `
})
export class PHeaderComponent {
  @Input() title = '';
}
