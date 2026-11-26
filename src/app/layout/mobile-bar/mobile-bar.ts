import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { whatsappUrl } from '../../core/site.config';

/** Sticky bottom bar on phones (< 768px): WhatsApp + Get quote. */
@Component({
  selector: 'app-mobile-bar',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar" [class.bar--single]="!wa">
      @if (wa) {
        <a class="btn btn--wa" [href]="wa" target="_blank" rel="noopener">WhatsApp</a>
      }
      <a class="btn btn--accent" routerLink="/contact">Get quote</a>
    </div>
  `,
  styles: `
    :host { display: none; }
    @media (max-width: 767px) { :host { display: block; } }
    .bar {
      position: fixed; left: 12px; right: 12px; bottom: max(12px, env(safe-area-inset-bottom)); z-index: 80;
      display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 8px;
      background: rgba(13, 12, 11, .9); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      border: 1px solid var(--c-border); border-radius: 999px;
    }
    .bar--single { grid-template-columns: 1fr; }
    .btn { min-height: 48px; }
  `,
})
export class MobileBar {
  protected readonly wa = whatsappUrl();
}
