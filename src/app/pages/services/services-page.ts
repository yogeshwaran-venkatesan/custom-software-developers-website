import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SERVICE_DETAILS } from '../../core/services.data';
import { PageHero } from '../../shared/page-hero/page-hero';
import { CtaBand } from '../../shared/cta-band/cta-band';

const MODELS = [
  { name: 'Fixed-scope project', fit: 'Websites, apps and systems with a clear scope', body: 'We write a requirement blueprint, agree a fixed quote and timeline, and deliver in weekly sprints.' },
  { name: 'Monthly sprint team', fit: 'Products that keep growing', body: 'A dedicated team on a monthly plan. You set priorities each sprint and see a working build every week.' },
  { name: 'Annual maintenance (AMC)', fit: 'Software already live', body: 'Fixes, security and OS updates, backups and small improvements, with an agreed response time.' },
];

@Component({
  selector: 'app-services-page',
  imports: [RouterLink, PageHero, CtaBand],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero kicker="Services" title="Everything we build, and how we work with you"
      intro="Websites, AI solutions, mobile apps, ERPs and SaaS, engineered to fit your business. Pick a service to see what is included.">
      <a class="btn btn--accent" routerLink="/contact">Start a project</a>
      <a class="btn btn--ghost" [routerLink]="[]" fragment="models">Engagement models</a>
    </app-page-hero>

    <section class="sv" aria-label="Our services">
      <ul class="grid">
        @for (s of services; track s.letter) {
          <li>
            <a [routerLink]="s.path" class="card">
              <span class="lt" aria-hidden="true">{{ s.letter }}</span>
              <h2>{{ s.name }}</h2>
              <p>{{ s.summary }}</p>
              <ul class="chips">@for (d of s.deliverables; track d) { <li>{{ d }}</li> }</ul>
              <span class="go">See what's included <span aria-hidden="true">→</span></span>
            </a>
          </li>
        }
      </ul>
    </section>

    <section class="md" id="models" aria-labelledby="md-title">
      <h2 id="md-title">Three ways to work with us</h2>
      <ol>
        @for (m of models; track m.name; let i = $index) {
          <li>
            <span class="mono n">0{{ i + 1 }}</span>
            <h3>{{ m.name }}</h3>
            <p class="fit">{{ m.fit }}</p>
            <p>{{ m.body }}</p>
          </li>
        }
      </ol>
      <p class="own">Whichever model you choose, you own 100% of the source code, the database and every account.</p>
    </section>

    <app-cta-band />
  `,
  styles: `
    :host { display: block; }
    .sv { background: var(--c-alab); padding: clamp(64px, 8vw, 104px) var(--pad-x); }
    .grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(6, 1fr); gap: 18px;
      > li { grid-column: span 2; } > li:nth-child(n + 4) { grid-column: span 3; } }
    .card { height: 100%; display: flex; flex-direction: column; gap: 14px; padding: 30px; background: var(--c-card); border: 1px solid var(--c-line);
      border-radius: 22px; color: inherit; text-decoration: none; position: relative; overflow: hidden;
      transition: border-color .25s, transform .35s var(--ease-out), box-shadow .35s;
      &:hover, &:focus-visible { border-color: var(--c-accent); transform: translateY(-4px); box-shadow: 0 24px 50px -30px rgba(6, 41, 44, .45); }
      &:hover .lt { color: var(--c-accent); } }
    .lt { font: 800 4.5rem/1 var(--f-disp); color: transparent; -webkit-text-stroke: 1.5px var(--c-accent-h); transition: color .3s; }
    h2 { font-size: 1.5rem; line-height: 1.15; }
    p { color: var(--c-ink-2); }
    .chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px;
      li { font-size: 13px; padding: 5px 10px; border: 1px solid var(--c-line); border-radius: 999px; color: var(--c-ink-2); } }
    .go { margin-top: auto; padding-top: 8px; font-weight: 600; color: var(--c-accent-h); }
    .md { background: var(--c-card); border-top: 1px solid var(--c-line); padding: clamp(72px, 9vw, 112px) var(--pad-x); scroll-margin-top: var(--header-h);
      h2 { font-size: clamp(2.2rem, 1rem + 3vw, 3.6rem); line-height: 1.02; margin-bottom: 40px; max-width: 14ch; } }
    ol { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid var(--c-line); }
    ol li { padding: 30px; border-left: 1px solid var(--c-line); &:first-child { border-left: 0; } }
    .n { color: var(--c-accent-h); }
    h3 { font-size: 1.35rem; margin: 28px 0 6px; }
    .fit { font-weight: 600; color: var(--c-ink); margin-bottom: 10px; font-size: 15px; }
    .own { margin-top: 28px; font-weight: 600; }
    @media (max-width: 1023px) {
      .grid { grid-template-columns: 1fr; > li, > li:nth-child(n + 4) { grid-column: auto; } }
      ol { grid-template-columns: 1fr; } ol li { border-left: 0; border-top: 1px solid var(--c-line); &:first-child { border-top: 0; } }
    }
  `,
})
export class ServicesPage {
  protected readonly services = SERVICE_DETAILS;
  protected readonly models = MODELS;
}
