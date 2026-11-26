import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/site.config';
import { PageHero } from '../../shared/page-hero/page-hero';
import { CtaBand } from '../../shared/cta-band/cta-band';

const PRINCIPLES = [
  { t: 'You own everything', b: 'Source code, database, domain, hosting and app store accounts are in your name. No lock-in, no licence fees to us.' },
  { t: 'Software fits the business', b: 'We study how your team already works and build around it, instead of forcing a ready-made product on you.' },
  { t: 'Show, don\'t tell', b: 'You see a working build every week. Progress is something you can open on your own phone.' },
  { t: 'Plain answers', b: 'Fixed quotes for agreed scope, honest advice on what not to build, and no jargon in our updates.' },
];

const STACK = [
  { area: 'Web', items: ['Angular', 'Next.js', 'TypeScript', 'SCSS'] },
  { area: 'Mobile', items: ['Flutter', 'React Native', 'Ionic', 'Firebase'] },
  { area: 'Backend', items: ['Node.js', '.NET', 'Python', 'REST APIs'] },
  { area: 'Data & cloud', items: ['PostgreSQL', 'SQL Server', 'AWS', 'Firebase'] },
  { area: 'AI', items: ['LLM APIs', 'Speech-to-text', 'RAG search', 'Telephony APIs'] },
];

@Component({
  selector: 'app-about-page',
  imports: [RouterLink, PageHero, CtaBand],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero kicker="About" title="Engineering you own outright"
      intro="We are a small team of software engineers building websites, AI solutions, mobile apps and business systems. We take full responsibility for the code, the integration and the scale."
      img="studio-developer" imgAlt="A developer at work across two monitors in a studio">
      <a class="btn btn--accent" routerLink="/contact">Work with us</a>
    </app-page-hero>

    <section class="pp" aria-labelledby="pp-title">
      <h2 id="pp-title">How we think</h2>
      <ul>
        @for (p of principles; track p.t; let i = $index) {
          <li><span class="mono">0{{ i + 1 }}</span><h3>{{ p.t }}</h3><p>{{ p.b }}</p></li>
        }
      </ul>
    </section>

    <section class="st" aria-labelledby="st-title">
      <h2 id="st-title">The stack we build with<i class="sq"></i></h2>
      <dl>
        @for (s of stack; track s.area) {
          <div><dt class="mono">{{ s.area }}</dt><dd>@for (i of s.items; track i) { <span>{{ i }}</span> }</dd></div>
        }
      </dl>
    </section>

    <section class="fx">
      <div><span class="mono">Registration</span><b>{{ site.registration }}</b></div>
      <div><span class="mono">Based in</span><b>India, working with clients remotely</b></div>
      <div><span class="mono">Email</span><b><a [href]="'mailto:' + site.email">{{ site.email }}</a></b></div>
    </section>

    <app-cta-band />
  `,
  styles: `
    :host { display: block; }
    .pp { background: var(--c-alab); padding: clamp(72px, 9vw, 112px) var(--pad-x);
      h2 { font-size: clamp(2.2rem, 1rem + 3vw, 3.6rem); line-height: 1.02; margin-bottom: 36px; }
      ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
      li { background: var(--c-card); border: 1px solid var(--c-line); border-radius: 20px; padding: 30px; }
      .mono { color: var(--c-accent-h); }
      h3 { font-size: 1.4rem; margin: 22px 0 8px; }
      p { color: var(--c-ink-2); } }
    .st { background: var(--c-char); color: #fff; padding: clamp(72px, 9vw, 112px) var(--pad-x);
      h2 { font-size: clamp(2.2rem, 1rem + 3vw, 3.6rem); line-height: 1.02; margin-bottom: 36px; }
      dl { margin: 0; border-top: 1px solid rgba(255,255,255,.12); }
      div { display: grid; grid-template-columns: 200px 1fr; gap: 16px; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,.12); align-items: center; }
      dt { color: var(--c-accent); }
      dd { margin: 0; display: flex; flex-wrap: wrap; gap: 8px; }
      span { padding: 7px 13px; border: 1px solid rgba(255,255,255,.18); border-radius: 999px; font-size: 14px; color: #e7e4dd; } }
    .fx { background: var(--c-card); border-top: 1px solid var(--c-line); padding: 40px var(--pad-x); display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
      div { display: grid; gap: 6px; } .mono { color: var(--c-ink-2); font-size: 12px; } b { font-weight: 600; overflow-wrap: anywhere; }
      a { color: var(--c-accent-h); } }
    @media (max-width: 1023px) {
      .pp ul, .fx { grid-template-columns: 1fr; }
      .st div { grid-template-columns: 1fr; gap: 10px; }
    }
  `,
})
export class AboutPage {
  protected readonly principles = PRINCIPLES;
  protected readonly stack = STACK;
  protected readonly site = SITE;
}
