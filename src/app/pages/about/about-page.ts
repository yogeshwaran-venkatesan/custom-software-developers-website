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

const HIGHLIGHTS = [
  { n: '5+ years', t: 'Building ERP, billing and business software that runs in production every day.' },
  { n: 'ERP specialists', t: 'Inventory, barcode billing, GST invoicing, accounts, reports and multi-branch setups.' },
  { n: 'Latest stack', t: 'Current versions of Angular, .NET, Node.js and Python, kept up to date, never legacy code.' },
  { n: 'AI agents', t: 'Voice and chat agents, smart search and automation built into your workflow.' },
];

const STRENGTHS = [
  { t: 'ERP and billing systems', b: 'Inventory, barcode billing, GST invoices, purchase, accounts and reports, built around how your business already works.' },
  { t: 'Plugin and system integration', b: 'We connect payment, messaging, accounting and other third-party systems using their latest APIs and plugins.' },
  { t: 'Upgrades and modernisation', b: 'We move older software to the latest framework versions, safely and without losing data.' },
  { t: 'AI agents', b: 'Voice agents that call customers with reminders, chat assistants that answer from your data, and smart search across your records.' },
  { t: 'Websites and mobile apps', b: 'Fast, SEO-ready websites and Android/iOS apps connected to your system.' },
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
    <app-page-hero kicker="About" title="A small team. Serious experience."
      intro="We are a small team of experienced developers with 5+ years of building ERP software, business web apps and mobile apps. We integrate plugins and third-party systems on the latest versions of today's programming languages and frameworks, and we build AI agents that work inside your business. We take full responsibility for the code, the integration and the scale."
      img="studio-developer" imgAlt="A developer at work across two monitors in a studio">
      <a class="btn btn--accent" routerLink="/contact">Work with us</a>
    </app-page-hero>

    <section class="who" aria-labelledby="who-title">
      <div class="who__head">
        <h2 id="who-title">Built by developers who have done this before</h2>
        <p>We are not a big agency with layers of managers. You talk directly to the developers who design and write your software. Between us we have spent more than five years building ERP and billing systems used every day by real businesses. That experience means we know where business software usually breaks, and we build it so it doesn't.</p>
      </div>
      <ul class="who__cards">
        @for (h of highlights; track h.n) {
          <li><b>{{ h.n }}</b><p>{{ h.t }}</p></li>
        }
      </ul>
    </section>

    <section class="sk" aria-labelledby="sk-title">
      <h2 id="sk-title">What we do best</h2>
      <ol>
        @for (s of strengths; track s.t; let i = $index) {
          <li><span class="mono">0{{ i + 1 }}</span><div><h3>{{ s.t }}</h3><p>{{ s.b }}</p></div></li>
        }
      </ol>
    </section>

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
      <p class="st__note">We keep every project on current, supported versions, so your software stays secure and easy to maintain.</p>
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
    .who { padding: clamp(72px, 9vw, 112px) var(--pad-x); background: var(--c-bg);
      display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: clamp(32px, 5vw, 72px); align-items: start;
      h2 { font-size: clamp(2.2rem, 1rem + 3vw, 3.6rem); line-height: 1.02; }
      .who__head p { margin-top: 22px; color: var(--c-ink-2); font-size: 1.08rem; line-height: 1.7; max-width: 52ch; }
      ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
      li { background: var(--c-card); border: 1px solid var(--c-line); border-radius: 20px; padding: 28px; position: relative; overflow: hidden; }
      li::before { content: ''; position: absolute; inset: 0 auto auto 0; width: 64px; height: 3px; background: var(--c-accent); }
      b { display: block; font: 800 clamp(1.5rem, 1.1rem + 1vw, 2rem)/1.1 var(--f-disp); letter-spacing: -.02em; color: var(--c-accent); }
      li p { margin-top: 10px; color: var(--c-ink-2); } }
    .sk { padding: clamp(72px, 9vw, 112px) var(--pad-x); background: var(--c-card); border-block: 1px solid var(--c-line);
      h2 { font-size: clamp(2.2rem, 1rem + 3vw, 3.6rem); line-height: 1.02; margin-bottom: 28px; }
      ol { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--c-line); }
      li { display: grid; grid-template-columns: 80px minmax(0, 1fr); gap: 16px; padding: 24px 0; border-bottom: 1px solid var(--c-line); }
      .mono { color: var(--c-accent); padding-top: 4px; }
      h3 { font-size: 1.3rem; }
      p { margin-top: 6px; color: var(--c-ink-2); max-width: 70ch; } }
    .st__note { margin: -20px 0 28px; color: #cdcbca; max-width: 60ch; }
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
    @media (max-width: 640px) { .who ul { grid-template-columns: 1fr; } }
    @media (max-width: 1023px) {
      .who { grid-template-columns: 1fr; }
      .sk li { grid-template-columns: 48px minmax(0, 1fr); }
      .pp ul, .fx { grid-template-columns: 1fr; }
      .st div { grid-template-columns: 1fr; gap: 10px; }
    }
  `,
})
export class AboutPage {
  protected readonly principles = PRINCIPLES;
  protected readonly stack = STACK;
  protected readonly highlights = HIGHLIGHTS;
  protected readonly strengths = STRENGTHS;
  protected readonly site = SITE;
}
