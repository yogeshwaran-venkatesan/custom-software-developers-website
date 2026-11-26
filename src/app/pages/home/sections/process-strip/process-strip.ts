import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { MotionService } from '../../../../core/motion.service';

const STEPS = [
  { title: 'Requirement blueprint', body: 'We map your exact business logic, users and edge cases, and agree scope and cost in writing.' },
  { title: 'UI/UX & system architecture', body: 'Clickable wireframes and a technical plan before any code is written.' },
  { title: 'Weekly agile sprints', body: 'A live working build every week that you can open on your own phone.' },
  { title: 'Cloud deployment & AMC', body: 'Launch, team training, and ongoing support under an annual maintenance contract.' },
];

/**
 * "Four steps, no surprises" — scrollytelling.
 * Desktop (>= 1024px, motion allowed): the section pins; scrolling walks through the four steps while the stage on the
 * right plays a small scene for each step (blueprint, wireframes, weekly builds, deployment). Snaps to each step;
 * clicking a step scrolls to it.
 * Mobile / reduced motion: a vertical list with a progress line; the stage shows on desktop only.
 */
@Component({
  selector: 'app-process-strip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './process-strip.html',
  styleUrl: './process-strip.scss',
})
export class ProcessStrip {
  private readonly motion = inject(MotionService);
  protected readonly steps = STEPS;
  /** 0..1 progress through the steps; starts complete for SSR / reduced motion. */
  protected readonly progress = signal(1);
  protected readonly active = signal(0);
  protected readonly weeks = [1, 2, 3, 4, 5, 6];
  private pin?: { start: number; end: number };

  constructor() {
    const host = inject(ElementRef<HTMLElement>);
    const destroyRef = inject(DestroyRef);
    afterNextRender(async () => {
      const kit = await this.motion.kit();
      if (!kit || kit.reduced) return;
      const { gsap, ScrollTrigger } = kit;
      const el = host.nativeElement as HTMLElement;
      const section = el.querySelector('.pr') as HTMLElement;
      const n = STEPS.length;
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        this.progress.set(0);
        const st = ScrollTrigger.create({
          trigger: section, start: 'top top', end: () => '+=' + window.innerHeight * (n - 1) * 0.8,
          pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true,
          snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.5 }, delay: 0.08, ease: 'power2.inOut' },
          onRefresh: (s) => { this.pin = { start: s.start, end: s.end }; },
          onUpdate: (s) => {
            this.progress.set(s.progress);
            const i = Math.round(s.progress * (n - 1));
            if (i !== this.active()) this.active.set(i);
          },
        });
        this.pin = { start: st.start, end: st.end };
        return () => { this.pin = undefined; this.progress.set(1); this.active.set(0); };
      });

      mm.add('(max-width: 1023px)', () => {
        this.progress.set(0);
        const st = ScrollTrigger.create({
          trigger: el.querySelector('.steps'), start: 'top 75%', end: 'bottom 55%',
          onUpdate: (s) => this.progress.set(s.progress),
        });
        return () => { st.kill(); this.progress.set(1); };
      });
      destroyRef.onDestroy(() => mm.revert());
    });
  }

  protected go(i: number): void {
    if (this.pin) this.motion.scrollToY(this.pin.start + (this.pin.end - this.pin.start) * (i / (STEPS.length - 1)));
    else this.active.set(i);
  }
}
