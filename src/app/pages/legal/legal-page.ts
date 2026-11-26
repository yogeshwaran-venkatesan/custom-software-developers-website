import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { SITE } from '../../core/site.config';
import { LEGAL } from './legal.data';

@Component({
  selector: 'app-legal-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let d = doc();
    <article class="lg">
      <header>
        <p class="mono">Legal · Last updated {{ d.updated }}</p>
        <h1>{{ d.title }}<i class="sq"></i></h1>
        <p class="intro">{{ d.intro }}</p>
      </header>
      @for (s of d.sections; track s.h) {
        <section><h2>{{ s.h }}</h2>@for (p of s.p; track $index) { <p>{{ fill(p) }}</p> }</section>
      }
    </article>
  `,
  styles: `
    :host { display: block; background: var(--c-alab); }
    .lg { max-width: 820px; padding: calc(var(--header-h) + clamp(48px, 7vw, 88px)) var(--pad-x) clamp(72px, 9vw, 112px); margin: 0 auto; box-sizing: content-box; }
    header { margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid var(--c-line); }
    .mono { color: var(--c-accent-h); }
    h1 { font-size: clamp(2.4rem, 1rem + 4vw, 4rem); line-height: 1.02; margin: 14px 0 16px; }
    .intro { font-size: 1.12rem; color: var(--c-ink-2); }
    section { margin-top: 32px; }
    h2 { font-size: 1.3rem; margin-bottom: 10px; }
    section p { color: var(--c-ink-2); margin-bottom: 12px; max-width: 70ch; }
  `,
})
export class LegalPage {
  private readonly key = toSignal(inject(ActivatedRoute).data.pipe(map((d) => d['doc'] as 'privacy' | 'terms')), { initialValue: 'privacy' as const });
  protected readonly doc = computed(() => LEGAL[this.key()]);
  protected fill(p: string): string { return p.replace('{email}', SITE.email); }
}
