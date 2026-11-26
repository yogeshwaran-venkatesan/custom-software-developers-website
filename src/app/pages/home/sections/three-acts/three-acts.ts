import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MotionService } from '../../../../core/motion.service';

const ACTS = [
  {
    n: '01', title: 'Workflow Discovery & Blueprint',
    body: 'We sit with your team, map how work really flows today, and agree the scope, milestones and cost in writing before any code.',
    you: ['Written requirement blueprint', 'Clickable wireframes', 'Fixed milestones and price'],
  },
  {
    n: '02', title: 'Custom Engineering & AI Integration',
    body: 'Weekly builds you can open on your own phone. Billing, apps and AI agents are wired into one system, not stitched together later.',
    you: ['A working build every week', 'AI and payments integrated', 'You pay per milestone'],
  },
  {
    n: '03', title: 'Live Deployment, Code Handover & AMC',
    body: 'We launch on your cloud account, train your staff and hand over the full source code. Then we stay on under an annual maintenance contract.',
    you: ['Full source code and IP', 'Team training', 'AMC support after launch'],
  },
];

/**
 * The 3-act transformation: oversized chapter numerals 01 → 02 → 03.
 * Each act lights up (numeral fills with the accent) as it scrolls into view; a progress line joins them on desktop.
 * Reduced motion: all acts shown lit.
 */
@Component({
  selector: 'app-three-acts',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="acts" id="process" aria-labelledby="acts-title">
      <div class="acts__head">
        <h2 id="acts-title" class="h-sec">From your workflow to live software, in three acts.</h2>
        <a class="btn btn--ghost btn--sm" routerLink="/process">See the full process</a>
      </div>
      <ol class="list">
        @for (a of acts; track a.n) {
          <li class="act is-lit">
            <span class="num" aria-hidden="true">{{ a.n }}</span>
            <h3><span class="sr-only">Act {{ a.n }}: </span>{{ a.title }}</h3>
            <p>{{ a.body }}</p>
            <ul class="you">@for (y of a.you; track y) { <li>{{ y }}</li> }</ul>
          </li>
        }
      </ol>
    </section>
  `,
  styles: `
    :host { display: block; }
    .acts { padding: clamp(80px, 10vw, 136px) var(--pad-x); background: var(--c-bg); border-top: 1px solid var(--c-border); }
    .acts__head { display: flex; flex-wrap: wrap; gap: 20px 48px; justify-content: space-between; align-items: flex-end;
      h2 { max-width: 18ch; } }
    .list { list-style: none; margin: clamp(48px, 6vw, 80px) 0 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: clamp(16px, 2vw, 28px); counter-reset: none; }
    .act { position: relative; padding: 28px 28px 32px; border-radius: 28px; background: var(--c-card); border: 1px solid var(--c-border);
      transition: border-color .5s, box-shadow .6s var(--ease-out); }
    .num { display: block; font: 800 clamp(96px, 11vw, 168px)/.85 var(--f-disp); letter-spacing: -.06em; margin: -4px 0 28px;
      color: transparent; -webkit-text-stroke: 1.5px rgba(255, 255, 255, .22); transition: color .6s, -webkit-text-stroke-color .6s; }
    .act.is-lit { border-color: rgba(242, 163, 58, .35); box-shadow: 0 40px 80px -50px rgba(242, 163, 58, .6); }
    .act.is-lit .num { color: var(--c-accent); -webkit-text-stroke-color: transparent; }
    h3 { font-size: clamp(1.35rem, 1rem + .9vw, 1.75rem); line-height: 1.15; }
    p { margin-top: 12px; color: var(--c-muted); }
    .you { list-style: none; margin: 22px 0 0; padding: 18px 0 0; border-top: 1px solid var(--c-border); display: grid; gap: 8px; font-size: 14.5px;
      li::before { content: '✓'; color: var(--c-accent); margin-right: 8px; } }
    @media (max-width: 1023px) { .list { grid-template-columns: 1fr; } }
  `,
})
export class ThreeActs {
  protected readonly acts = ACTS;
  private readonly motion = inject(MotionService);
  private readonly host = inject(ElementRef<HTMLElement>);

  constructor() {
    afterNextRender(async () => {
      const kit = await this.motion.kit();
      if (!kit || kit.reduced) return;
      const items = [...(this.host.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.act')];
      items.forEach((el) => {
        el.classList.remove('is-lit');
        kit.ScrollTrigger.create({ trigger: el, start: 'top 70%', onEnter: () => el.classList.add('is-lit'), onLeaveBack: () => el.classList.remove('is-lit') });
      });
    });
  }
}
