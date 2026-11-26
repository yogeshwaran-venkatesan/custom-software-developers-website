import {
  ChangeDetectionStrategy, Component, ElementRef, afterNextRender, computed, inject, signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SERVICE_DETAILS } from '../../../../core/services.data';
import { MotionService } from '../../../../core/motion.service';

/**
 * "Five core strengths. No limit to what we build."
 *
 * Desktop (>= 1024px, motion on): as the visitor scrolls from the hero, the accent letters W A M E S detach from the
 * hero signature line and travel along a curved path (x and y on different eases, rotation -8deg to +8deg settling
 * to 0) into the five arc cards, which rise into place at the same time. Scrubbed with the scroll.
 * Phones and tablets: cards stack and reveal with a stagger. Reduced motion: no movement.
 * Selecting a card (click or arrow keys) shows how that pillar connects and links to its service page.
 */
@Component({
  selector: 'app-services-arc',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './services-arc.html',
  styleUrl: './services-arc.scss',
})
export class ServicesArc {
  private readonly motion = inject(MotionService);
  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly services = SERVICE_DETAILS;
  protected readonly active = signal(0);
  protected readonly current = computed(() => this.services[this.active()]);

  constructor() {
    afterNextRender(async () => {
      const kit = await this.motion.kit();
      if (!kit || kit.reduced) return;
      const { gsap } = kit;
      const root = this.host.nativeElement as HTMLElement;
      const section = root.querySelector('.svc') as HTMLElement;
      const cards = [...root.querySelectorAll<HTMLElement>('.card')];
      const letters = [...root.querySelectorAll<HTMLElement>('.card__l')];

      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        const source = (k: string) => document.querySelector<HTMLElement>(`[data-sig="${k}"][data-sig-scope="hero"]`);
        /** Layout position in the document, ignoring CSS transforms (so running tweens never skew the measurement). */
        const docPos = (el: HTMLElement) => {
          let x = 0, y = 0, n: HTMLElement | null = el;
          while (n) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
          return { x: x + el.offsetWidth / 2, y: y + el.offsetHeight / 2, h: el.offsetHeight };
        };
        const delta = (el: HTMLElement) => {
          const src = source(el.dataset['arc'] ?? '');
          if (!src) return { dx: 0, dy: 0, s: 1 };
          const a = docPos(src), b = docPos(el);
          return { dx: a.x - b.x, dy: a.y - b.y, s: Math.max(.15, a.h / b.h) };
        };
        const heroLetters = [...document.querySelectorAll<HTMLElement>('[data-sig-scope="hero"]')];

        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 15%', scrub: 0.8, invalidateOnRefresh: true },
        });
        tl.from(cards, {
          y: 140, opacity: 0, rotation: (i: number) => (i - 2) * 4, transformOrigin: '50% 100%',
          stagger: 0.06, ease: 'power2.out', duration: 1,
        }, 0);
        letters.forEach((el, i) => {
          const rot = (i - 2) * 4; // -8deg … +8deg across the arc
          // x and y on different eases trace a curved, arc-like path; rotation settles to 0 so text stays sharp.
          tl.from(el, { x: () => delta(el).dx, ease: 'power1.out', duration: 1 }, 0)
            .from(el, { y: () => delta(el).dy, ease: 'power2.in', duration: 1 }, 0)
            .from(el, { scale: () => delta(el).s, rotation: rot, ease: 'power1.inOut', duration: 1 }, 0);
        });
        tl.to(heroLetters, { opacity: 0.18, ease: 'none', duration: 0.6 }, 0);
        return () => { gsap.set(heroLetters, { clearProps: 'opacity' }); };
      });

      mm.add('(max-width: 1023px)', () => {
        gsap.from(cards, {
          y: 40, opacity: 0, rotation: (i: number) => (i % 2 ? 2 : -2), stagger: 0.08, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: root.querySelector('.arc'), start: 'top 85%', once: true },
        });
      });
    });
  }

  protected onKey(e: KeyboardEvent, i: number): void {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (i + dir + this.services.length) % this.services.length;
    this.active.set(n);
    (document.getElementById('svc-tab-' + this.services[n].letter) as HTMLElement | null)?.focus();
  }
}
