import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SITE, whatsappUrl } from '../../core/site.config';
import { PageHero } from '../../shared/page-hero/page-hero';
import { ScopeReceipt } from '../home/sections/scope-receipt/scope-receipt';

@Component({
  selector: 'app-contact-page',
  imports: [PageHero, ScopeReceipt],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero kicker="Contact" title="Let's start your project"
      intro="Build your scope below and send it on WhatsApp or email. We reply with questions, a plan and an estimate.">
      <a class="btn btn--accent" [href]="'mailto:' + site.email">{{ site.email }}</a>
      @if (wa) { <a class="btn btn--wa" [href]="wa" target="_blank" rel="noopener">WhatsApp us</a> }
    </app-page-hero>
    <app-scope-receipt [showTicker]="false" />
    <section class="nx" aria-labelledby="nx-title">
      <h2 id="nx-title">What happens next</h2>
      <ol>
        <li><b>We read your brief</b><span>and reply with a few questions to understand the problem.</span></li>
        <li><b>A short call</b><span>to walk through how you work today and what should change.</span></li>
        <li><b>Blueprint and quote</b><span>a written scope with a fixed price and timeline. No obligation.</span></li>
      </ol>
    </section>
  `,
  styles: `
    :host { display: block; }
    .nx { background: var(--c-alab); border-top: 1px solid var(--c-line); padding: clamp(64px, 8vw, 96px) var(--pad-x);
      h2 { font-size: clamp(1.9rem, 1rem + 2vw, 2.8rem); margin-bottom: 28px; }
      ol { margin: 0; padding: 0; list-style: none; counter-reset: n; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
      li { counter-increment: n; background: var(--c-card); border: 1px solid var(--c-line); border-radius: 20px; padding: 26px; display: grid; gap: 6px;
        &::before { content: '0' counter(n); font: 500 13px var(--f-mono); color: var(--c-accent-h); margin-bottom: 14px; } }
      b { font: 700 1.2rem var(--f-disp); } span { color: var(--c-ink-2); } }
    @media (max-width: 1023px) { .nx ol { grid-template-columns: 1fr; } }
  `,
})
export class ContactPage {
  protected readonly site = SITE;
  protected readonly wa = whatsappUrl();
}
