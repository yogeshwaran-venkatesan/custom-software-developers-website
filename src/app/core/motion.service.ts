import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { gsap as Gsap } from 'gsap';
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

export interface MotionKit {
  gsap: typeof Gsap;
  ScrollTrigger: typeof ST;
  reduced: boolean;
}

/**
 * Loads GSAP + ScrollTrigger + Lenis once, in the browser only (never during SSR/prerender).
 * Components call `kit()` from afterNextRender.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private loading?: Promise<MotionKit | null>;
  private lenis?: Lenis;

  /** True when the operating system asks for reduced motion (Windows "Animation effects" off, macOS "Reduce motion"). */
  isReduced(): boolean {
    if (!this.isBrowser) return true;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  kit(): Promise<MotionKit | null> {
    if (!this.isBrowser) return Promise.resolve(null);
    this.loading ??= (async () => {
      // Load the animation libraries on the visitor's first scroll, touch, click or key press (or if the page opens
      // already scrolled), so they never compete with the first paint and page start-up.
      await new Promise<void>((resolve) => {
        if (window.scrollY > 0) { resolve(); return; }
        const events = ['scroll', 'wheel', 'pointerdown', 'touchstart', 'keydown'] as const;
        const go = () => { events.forEach((e) => window.removeEventListener(e, go)); resolve(); };
        events.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
      });
      const [{ gsap }, { ScrollTrigger }, { default: LenisCtor }] = await Promise.all([
        import('gsap'), import('gsap/ScrollTrigger'), import('lenis'),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      const reduced = this.isReduced();
      document.documentElement.classList.toggle('motion-on', !reduced);
      if (!reduced) {
        this.lenis = new LenisCtor({ lerp: 0.1 });
        this.lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((t) => this.lenis?.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      }
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return { gsap, ScrollTrigger, reduced };
    })();
    return this.loading;
  }

  /** Smooth-scroll to an absolute page Y position. */
  scrollToY(y: number): void {
    if (this.lenis) this.lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  }

  /** Smooth-scroll to an element (falls back to native). */
  scrollTo(el: HTMLElement): void {
    if (this.lenis) this.lenis.scrollTo(el, { offset: -70, duration: 1.4 });
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
