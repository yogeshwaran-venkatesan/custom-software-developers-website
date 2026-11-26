import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../shared/page-hero/page-hero';
import { CtaBand } from '../../shared/cta-band/cta-band';
import { Faq } from '../../shared/faq/faq';
import { ProcessStrip } from '../home/sections/process-strip/process-strip';

const DETAIL = [
  { step: 'Requirement blueprint', you: 'A short call and access to how you work today: forms, sheets, screenshots.',
    get: ['Written scope with users, screens and rules', 'Fixed quote and timeline', 'List of what is not included'] },
  { step: 'UI/UX & system architecture', you: 'Feedback on the screens and sample data.',
    get: ['Clickable wireframes of key screens', 'Database and integration plan', 'Hosting and security plan'] },
  { step: 'Weekly agile sprints', you: 'About 30 minutes a week to review and give feedback.',
    get: ['A working build every week on your phone or browser', 'Short written progress note', 'Changes handled in the next sprint'] },
  { step: 'Cloud deployment & AMC', you: 'Sign-off and time for team training.',
    get: ['Go-live on hosting in your name', 'Source code, database and every login', 'Training, documentation and AMC support'] },
];

const FAQS = [
  { q: 'What if I want changes in the middle?', a: 'Small changes go into the next sprint. Bigger changes are quoted separately, so you always know the cost first.' },
  { q: 'How do payments work?', a: 'Usually in milestones linked to the steps above, agreed in writing before work starts.' },
  { q: 'Do I get the source code?', a: 'Yes, always. The code, database and accounts are handed over in your name at go-live.' },
  { q: 'What does the AMC cover?', a: 'Bug fixes, security and OS updates, backups, monitoring and small improvements, with an agreed response time.' },
];

@Component({
  selector: 'app-process-page',
  imports: [RouterLink, PageHero, CtaBand, Faq, ProcessStrip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero kicker="Process" title="From requirement blueprint to AMC"
      intro="Four clear steps. You see working software every week, and nothing is billed that was not agreed in writing.">
      <a class="btn btn--accent" routerLink="/contact">Start with a blueprint</a>
    </app-page-hero>
    <app-process-strip />
    <section class="dt" aria-labelledby="dt-title">
      <h2 id="dt-title">What happens at each step</h2>
      @for (d of detail; track d.step; let i = $index) {
        <article>
          <span class="mono n">0{{ i + 1 }}</span>
          <h3>{{ d.step }}</h3>
          <div><p class="mono l">From you</p><p>{{ d.you }}</p></div>
          <div><p class="mono l">You get</p><ul>@for (g of d.get; track g) { <li>{{ g }}</li> }</ul></div>
        </article>
      }
    </section>
    <app-faq [items]="faqs" />
    <app-cta-band />
  `,
  styles: `
    :host { display: block; }
    .dt { background: var(--c-alab); padding: clamp(72px, 9vw, 112px) var(--pad-x);
      h2 { font-size: clamp(2.2rem, 1rem + 3vw, 3.6rem); line-height: 1.02; margin-bottom: 36px; } }
    article { display: grid; grid-template-columns: 60px 1fr 1fr 1.2fr; gap: 16px 32px; padding: 28px 0; border-top: 1px solid var(--c-line); align-items: start; }
    article:last-child { border-bottom: 1px solid var(--c-line); }
    .n { color: var(--c-accent-h); padding-top: 6px; }
    h3 { font-size: 1.35rem; line-height: 1.2; }
    .l { color: var(--c-ink-2); font-size: 12px; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 6px; }
    p, li { color: var(--c-ink-2); font-size: 15px; }
    ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 6px; }
    li::before { content: ''; display: inline-block; width: 7px; height: 7px; background: var(--c-accent); margin-right: 10px; vertical-align: middle; }
    @media (max-width: 1023px) { article { grid-template-columns: 1fr; gap: 12px; } }
  `,
})
export class ProcessPage {
  protected readonly detail = DETAIL;
  protected readonly faqs = FAQS;
}
