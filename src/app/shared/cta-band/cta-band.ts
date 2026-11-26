import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE, whatsappUrl } from '../../core/site.config';

/** Closing call to action used at the bottom of inner pages. */
@Component({
  selector: 'app-cta-band',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cta" aria-labelledby="cta-title">
      <div>
        <h2 id="cta-title">{{ title() }}<i class="sq"></i></h2>
        <p>{{ body() }}</p>
      </div>
      <div class="row">
        <a class="btn btn--accent" routerLink="/contact">Start a project</a>
        @if (wa) { <a class="btn btn--wa" [href]="wa" target="_blank" rel="noopener">WhatsApp us</a> }
        @else { <a class="btn btn--ghost" [href]="'mailto:' + email">Email us</a> }
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .cta { background: var(--c-char); color: #fff; padding: clamp(64px, 8vw, 104px) var(--pad-x);
      display: flex; flex-wrap: wrap; gap: 28px 64px; justify-content: space-between; align-items: flex-end;
      border-top: 1px solid rgba(255,255,255,.08); }
    h2 { font-size: clamp(2.2rem, 1rem + 3vw, 3.6rem); line-height: 1.02; max-width: 15ch; margin-bottom: 14px; }
    p { color: var(--c-muted); max-width: 52ch; }
    .row { display: flex; flex-wrap: wrap; gap: 12px; }
  `,
})
export class CtaBand {
  readonly title = input('Tell us what to build');
  readonly body = input('Describe the problem in a few lines. We reply with questions, a plan and an estimate.');
  protected readonly wa = whatsappUrl();
  protected readonly email = SITE.email;
}
