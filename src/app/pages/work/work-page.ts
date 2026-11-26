import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../shared/page-hero/page-hero';
import { CtaBand } from '../../shared/cta-band/cta-band';
import { FLAGS } from '../../core/site.config';
import { WorkPreview } from '../home/sections/work-preview/work-preview';
import { LivePreview } from '../home/sections/live-preview/live-preview';

@Component({
  selector: 'app-work-page',
  imports: [RouterLink, PageHero, CtaBand, WorkPreview, LivePreview],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero kicker="Live demos" title="Try what we build"
      intro="Interactive previews of the billing systems, AI voice agents and apps we deliver. Switch tabs and press the buttons to see how they behave."
      img="devices-slate" imgAlt="A phone and a tablet showing app screens on a slate desk">
      <a class="btn btn--accent" routerLink="/contact">Ask for a demo</a>
      <a class="btn btn--ghost" routerLink="/products/seettu-pro">See Seettu Pro</a>
    </app-page-hero>
    @if (showWork) { <app-work-preview [showAll]="false" /> }
    <app-live-preview />
    <section class="own">
      <p class="mono">Our own product</p>
      <h2>Seettu Pro, built and run by us</h2>
      <p>A savings-scheme app for shops, with a member mobile app, UPI payments, Tamil and English, and a shop counter dashboard.</p>
      <a class="btn btn--ghost-dark" routerLink="/products/seettu-pro">Explore Seettu Pro</a>
    </section>
    <app-cta-band title="Want to see a live demo?" body="Tell us what you are planning. We show you a working build of something similar on a short call." />
  `,
  styles: `
    :host { display: block; }
    .own { background: var(--c-alab); border-top: 1px solid var(--c-line); padding: clamp(64px, 8vw, 96px) var(--pad-x);
      display: grid; gap: 14px; justify-items: start;
      .mono { color: var(--c-accent-h); }
      h2 { font-size: clamp(2rem, 1rem + 2.4vw, 3rem); line-height: 1.05; }
      p:not(.mono) { color: var(--c-ink-2); max-width: 60ch; margin-bottom: 10px; } }
  `,
})
export class WorkPage {
  /** Client case studies hidden until ready (FLAGS.showWork). */
  protected readonly showWork = FLAGS.showWork;
}
