import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { SeoService } from '../../core/seo.service';

/** Accessible FAQ list built on native details/summary. */
@Component({
  selector: 'app-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="fq" aria-labelledby="fq-title">
      <h2 id="fq-title">{{ title() }}</h2>
      <div class="list">
        @for (f of items(); track f.q) {
          <details>
            <summary>{{ f.q }}<span class="pm" aria-hidden="true"></span></summary>
            <p>{{ f.a }}</p>
          </details>
        }
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .fq { background: var(--c-alab); padding: clamp(72px, 9vw, 112px) var(--pad-x);
      display: grid; grid-template-columns: 0.8fr 1.4fr; gap: 32px clamp(32px, 6vw, 96px); }
    h2 { font-size: clamp(2rem, 1rem + 2.4vw, 3rem); line-height: 1.05; }
    .list { border-top: 1px solid var(--c-line); }
    details { border-bottom: 1px solid var(--c-line); }
    summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; gap: 20px; align-items: center;
      padding: 22px 0; font: 600 1.1rem var(--f-disp); letter-spacing: -.01em;
      &::-webkit-details-marker { display: none; }
      &:focus-visible { outline: 2px solid var(--c-accent); outline-offset: 4px; } }
    .pm { flex: none; width: 14px; height: 14px; position: relative;
      &::before, &::after { content: ''; position: absolute; inset: 6px 0 auto; height: 2px; background: var(--c-accent-h); transition: transform .3s var(--ease-out); }
      &::after { transform: rotate(90deg); } }
    details[open] .pm::after { transform: rotate(0); }
    p { color: var(--c-ink-2); padding: 0 40px 24px 0; max-width: 64ch; }
    @media (max-width: 1023px) { .fq { grid-template-columns: 1fr; } }
  `,
})
export class Faq {
  readonly title = input('Questions we get asked');
  readonly items = input.required<{ q: string; a: string }[]>();

  constructor() {
    const seo = inject(SeoService);
    // FAQPage structured data so the questions can show in search results.
    effect(() => seo.setJsonLd('faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.items().map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    }));
  }
}
