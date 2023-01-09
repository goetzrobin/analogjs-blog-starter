import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  host: {
    class: 'block'
  },
  template: `
    <h1
      class="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
      {{title}}</h1>
    <p class="mt-6 text-base text-zinc-600 dark:text-zinc-400">
      {{intro}}
    </p>
  `,
})
export class PageHeaderComponent {
  @Input()
  public title = ''
  @Input()
  public intro = ''
}
