import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, input, viewChild,
} from '@angular/core';

/** Letters that are solid teal inside the hollow name: M, W, A, E, S. */
const HIGHLIGHT: Record<string, number[]> = { CUSTOM: [5], SOFTWARE: [4, 5], DEVELOPERS: [3, 9] };
const WORDS = ['CUSTOM', 'SOFTWARE', 'DEVELOPERS'].map((w) => ({
  chars: [...w].map((c, i) => ({ c, hi: HIGHLIGHT[w].includes(i) })),
}));

/**
 * Outlined "CUSTOM SOFTWARE DEVELOPERS" whose font size is fitted so the line
 * spans its container exactly. `stackOnMobile`: below 1024px, "CUSTOM SOFTWARE"
 * fills line one and "DEVELOPERS" wraps (used in the hero). Otherwise it stays on one line.
 */
@Component({
  selector: 'app-hollow-name',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p #line class="hn" [class.hn--stack]="stackOnMobile()" aria-label="Custom Software Developers">
      @for (word of words; track $index) {
        <span class="hn__w" aria-hidden="true">
          @for (ch of word.chars; track $index) {
            @if (ch.hi) {<b>{{ ch.c }}</b>} @else {{{ ch.c }}}
          }
        </span>
      }
    </p>
  `,
  styles: `
    :host { display: block; }
    .hn {
      margin: 0; display: flex; flex-wrap: nowrap; gap: 0 .5em; white-space: nowrap;
      font: 800 4vw/1 var(--f-disp); letter-spacing: .1em;
      color: transparent; -webkit-text-stroke: var(--hn-stroke, 1.4px) var(--hn-color, rgba(255, 255, 255, .42));
    }
    .hn__w { display: inline-block; }
    .hn__w:last-child { margin-right: -.1em; }
    b { color: var(--c-accent); -webkit-text-stroke: 0; font-weight: 800; }
    @media (max-width: 1023px) {
      .hn--stack { flex-wrap: wrap; gap: 6px .5em; -webkit-text-stroke-width: 1px; }
    }
  `,
})
export class HollowName {
  readonly stackOnMobile = input(false);
  protected readonly words = WORDS;
  private readonly line = viewChild.required<ElementRef<HTMLElement>>('line');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.line().nativeElement;
      const fit = () => {
        el.style.fontSize = '100px';
        const all = [...el.children] as HTMLElement[];
        const kids = this.stackOnMobile() && window.innerWidth < 1024 ? all.slice(0, 2) : all;
        const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
        const natural = kids.reduce((w, k) => w + k.getBoundingClientRect().width, 0) + gap * (kids.length - 1);
        if (natural > 0) el.style.fontSize = `${(100 * (el.clientWidth - 2)) / natural}px`;
      };
      let lastW = -1;
      // Only refit when the width changes (refitting changes height, which would loop).
      const ro = new ResizeObserver(([e]) => {
        const w = Math.round(e.contentRect.width);
        if (w !== lastW) { lastW = w; requestAnimationFrame(fit); }
      });
      ro.observe(el);
      document.fonts?.ready.then(fit);
      fit();
      destroyRef.onDestroy(() => ro.disconnect());
    });
  }
}
