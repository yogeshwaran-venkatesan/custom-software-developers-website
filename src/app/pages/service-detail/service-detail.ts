import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { SITE } from '../../core/site.config';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Letter, SERVICE_DETAILS } from '../../core/services.data';
import { SERVICE_PAGES } from '../../core/service-pages.data';
import { PageHero } from '../../shared/page-hero/page-hero';
import { CtaBand } from '../../shared/cta-band/cta-band';
import { Faq } from '../../shared/faq/faq';

/** One component for every /services/* page; the route data `letter` selects the content. */
@Component({
  selector: 'app-service-detail',
  imports: [RouterLink, PageHero, CtaBand, Faq],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let s = svc(); @let p = page();
    <app-page-hero [kicker]="s.name" [title]="s.headline" [intro]="s.summary" [img]="p.img" [imgAlt]="p.imgAlt">
      <a class="btn btn--accent" routerLink="/contact">Discuss your project</a>
      <!-- Hidden for now (owner request, 26 Nov 2026); restore when real case studies are ready:
      <a class="btn btn--ghost" routerLink="/work">See our work</a> -->
    </app-page-hero>

    <section class="fw">
      <h2>Who this is for</h2>
      <ul>@for (f of p.forWho; track f) { <li>{{ f }}</li> }</ul>
    </section>

    <section class="inc" aria-labelledby="inc-title">
      <h2 id="inc-title">What's included</h2>
      <ul class="grid">
        @for (i of p.includes; track i.title; let n = $index) {
          <li><span class="mono">{{ (n + 1).toString().padStart(2, '0') }}</span><h3>{{ i.title }}</h3><p>{{ i.body }}</p></li>
        }
      </ul>
      <div class="stack">
        <span class="mono">Built with</span>
        <ul>@for (t of s.stack; track t) { <li>{{ t }}</li> }</ul>
      </div>
    </section>

    <app-faq [items]="p.faqs" />

    <nav class="more" aria-label="Other services">
      <span class="mono">Other services</span>
      <ul>
        @for (o of others(); track o.letter) {
          <li><a [routerLink]="o.path"><b>{{ o.letter }}</b>{{ o.name }}</a></li>
        }
      </ul>
    </nav>

    <app-cta-band />
  `,
  styles: `
    :host { display: block; }
    .fw { background: var(--c-alab); padding: clamp(64px, 8vw, 96px) var(--pad-x) 0; display: grid; grid-template-columns: 0.8fr 1.4fr; gap: 24px clamp(32px, 6vw, 96px);
      h2 { font-size: clamp(1.8rem, 1rem + 2vw, 2.6rem); line-height: 1.05; }
      ul { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--c-line); }
      li { padding: 18px 0 18px 30px; border-bottom: 1px solid var(--c-line); position: relative; font-size: 1.08rem;
        &::before { content: ''; position: absolute; left: 0; top: 27px; width: 10px; height: 10px; background: var(--c-accent); } } }
    .inc { background: var(--c-alab); padding: clamp(64px, 8vw, 104px) var(--pad-x);
      h2 { font-size: clamp(2.2rem, 1rem + 3vw, 3.6rem); line-height: 1.02; margin-bottom: 36px; } }
    .grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
      li { background: var(--c-card); border: 1px solid var(--c-line); border-radius: 20px; padding: 28px; }
      .mono { color: var(--c-accent-h); }
      h3 { font-size: 1.25rem; margin: 20px 0 8px; }
      p { color: var(--c-ink-2); font-size: 15px; } }
    .stack { margin-top: 28px; display: flex; flex-wrap: wrap; gap: 12px 18px; align-items: center;
      .mono { color: var(--c-ink-2); }
      ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
      li { font: 500 13px var(--f-mono); padding: 7px 12px; border-radius: 999px; background: var(--c-char); color: #fff; } }
    .more { background: var(--c-card); border-top: 1px solid var(--c-line); padding: 36px var(--pad-x);
      display: flex; flex-wrap: wrap; gap: 16px 28px; align-items: center;
      .mono { color: var(--c-ink-2); }
      ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; }
      a { display: inline-flex; gap: 10px; align-items: center; min-height: 44px; padding: 0 16px 0 6px; border: 1px solid var(--c-line);
        border-radius: 999px; color: var(--c-ink); text-decoration: none; font-weight: 500;
        &:hover { border-color: var(--c-accent); } }
      b { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; background: var(--c-char); color: var(--c-accent); font: 800 14px var(--f-disp); } }
    @media (max-width: 1023px) { .fw { grid-template-columns: 1fr; } .grid { grid-template-columns: 1fr; } }
  `,
})
export class ServiceDetailPage {
  private readonly letter = toSignal(inject(ActivatedRoute).data.pipe(map((d) => d['letter'] as Letter)), { initialValue: 'W' as Letter });
  protected readonly svc = computed(() => SERVICE_DETAILS.find((s) => s.letter === this.letter())!);
  protected readonly page = computed(() => SERVICE_PAGES[this.letter()]);
  protected readonly others = computed(() => SERVICE_DETAILS.filter((s) => s.letter !== this.letter()));

  constructor() {
    const seo = inject(SeoService);
    // Service + breadcrumb structured data for this service page.
    effect(() => {
      const s = this.svc();
      const url = SITE.siteUrl + s.path;
      seo.setJsonLd('service', {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Service', name: s.name, description: s.summary, url, areaServed: 'IN',
            provider: { '@id': SITE.siteUrl + '/#org' },
            hasOfferCatalog: { '@type': 'OfferCatalog', name: s.name, itemListElement: s.deliverables.map((d) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: d } })) },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.siteUrl + '/' },
              { '@type': 'ListItem', position: 2, name: 'Services', item: SITE.siteUrl + '/services' },
              { '@type': 'ListItem', position: 3, name: s.name, item: url },
            ],
          },
        ],
      });
    });
  }
}
