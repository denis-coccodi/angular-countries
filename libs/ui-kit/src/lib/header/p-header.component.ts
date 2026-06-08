import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-p-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './p-header.component.html',
  styleUrl: './p-header.component.scss',
})
export class PHeaderComponent {
  readonly title = input('');
}
