import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="nf">
      <p class="mono">Error 404</p>
      <h1>This page isn't in the blueprint<i class="sq"></i></h1>
      <p>The link may be old or mistyped. Go back to the homepage, or tell us what you were looking for.</p>
      <div class="row">
        <a class="btn btn--accent" routerLink="/">Go to homepage</a>
        <a class="btn btn--ghost" routerLink="/contact">Contact us</a>
      </div>
    </section>
  `,
  styles: `
    .nf { min-height: 80svh; background: var(--c-char); color: #fff; padding: calc(var(--header-h) + 96px) var(--pad-x) 96px; }
    .mono { color: var(--c-accent); }
    h1 { font-size: clamp(2.4rem, 1rem + 4vw, 4.5rem); line-height: 1.02; margin: 16px 0; max-width: 16ch; }
    p { color: var(--c-muted); max-width: 56ch; }
    .row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
  `,
})
export class NotFound {}
