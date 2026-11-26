import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** {/C} mark (espresso tile, amber slash) + wordmark with W A M E S in the accent. */
@Component({
  selector: 'app-brand-logo',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="logo" routerLink="/" [attr.aria-label]="'Custom Software Developers, home'">
      <img class="mark" src="/img/logo-mark.svg" alt="" width="42" height="42" />
      <span class="txt">
        <span class="word" [class.word--lg]="size() === 'lg'">
          CUSTO<b>M</b> SOFT<b>WA</b>RE DEV<b>E</b>LOPER<b>S</b>
        </span>
        @if (slogan()) { <span class="slogan">{{ slogan() }}</span> }
      </span>
    </a>
  `,
  styles: `
    .logo { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; color: #fff; }
    .mark { width: 42px; height: 42px; flex: none; filter: drop-shadow(0 6px 16px rgba(242, 163, 58, .25)); }
    /* W A M E S in the accent, same as the signature line */
    .word { white-space: nowrap; line-height: 1; font-family: var(--f-disp); font-weight: 800; font-size: 17px; letter-spacing: .08em;
      color: #fff; }
    @media (max-width: 480px) { .word { font-size: 13px; letter-spacing: .05em; } }
    .word b { color: var(--c-accent); font-weight: 800; }
    .word--lg { font-size: 22px; }
    .txt { display: flex; flex-direction: column; gap: 6px; }
    .slogan { font: 500 10.5px/1 var(--f-mono); letter-spacing: .16em; text-transform: uppercase; color: var(--c-dim); white-space: nowrap; }
    @media (max-width: 480px) { .slogan { display: none; } }
  `,
})
export class BrandLogo {
  readonly size = input<'md' | 'lg'>('md');
  /** Optional small line under the wordmark (the header passes SITE.slogan). */
  readonly slogan = input('');
}
