import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, input, signal, viewChild,
} from '@angular/core';

/** Index of the accent letter in each word: M (CUSTOM), W A (SOFTWARE), E S (DEVELOPERS). */
const HIGHLIGHT: Record<string, Record<number, string>> = {
  CUSTOM: { 5: 'M' }, SOFTWARE: { 4: 'W', 5: 'A' }, DEVELOPERS: { 3: 'E', 9: 'S' },
};
const WORDS = ['CUSTOM', 'SOFTWARE', 'DEVELOPERS'].map((w) => ({
  chars: [...w].map((c, i) => ({ c, key: HIGHLIGHT[w][i] ?? null })),
}));

/**
 * Brand signature line: solid "CUSTOM SOFTWARE DEVELOPERS" with only W, A, M, E, S in the accent colour.
 * The font size is fitted so the line spans its container exactly (one line on every width).
 * Accent letters carry data-sig="W|A|M|E|S" so the services section can lift them out on scroll.
 */
@Component({
  selector: 'app-signature-line',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sigbox">
      <p #line class="sig" [class.sig--hollow]="hollow()">
        <span class="sr-only">Custom Software Developers</span>
        @for (word of words; track $index) {
          <span class="sig__w" aria-hidden="true">
            @for (ch of word.chars; track $index) {
              @if (ch.key) {<b [attr.data-sig]="ch.key" [attr.data-sig-scope]="scope()">{{ ch.c }}</b>} @else {{{ ch.c }}}
            }
          </span>
        }
      </p>
      @if (hollow()) {
        <!-- Solid accent letters drawn on top of the outlined line -->
        <p class="sig sig--accent" aria-hidden="true" [style.font-size]="size()">
          @for (word of words; track $index) {
            <span class="sig__w">
              @for (ch of word.chars; track $index) {
                @if (ch.key) {<b [attr.data-sig-scope]="scope()">{{ ch.c }}</b>} @else {<span class="gh">{{ ch.c }}</span>}
              }
            </span>
          }
        </p>
        <svg class="defs" aria-hidden="true" focusable="false">
          <filter [attr.id]="'sig-outline-' + scope()" x="-2%" y="-20%" width="104%" height="140%" color-interpolation-filters="sRGB">
            <feMorphology in="SourceAlpha" operator="dilate" radius="1.3" result="grown" />
            <feComposite in="grown" in2="SourceAlpha" operator="out" result="ring" />
            <feFlood flood-color="#ffffff" flood-opacity="0.5" />
            <feComposite in2="ring" operator="in" />
          </filter>
        </svg>
      }
    </div>
  `,
  styles: `
    :host { display: block; min-width: 0; overflow: hidden; }
    .sig {
      margin: 0; display: flex; flex-wrap: nowrap; gap: 0 .32em; white-space: nowrap;
      font: 800 4vw/1 var(--f-disp); letter-spacing: .01em; color: var(--sig-color, #fff);
    }
    .sig__w { display: inline-block; }
    b { display: inline-block; color: var(--c-accent); font-weight: 800; }
    /* Hollow variant: an SVG filter turns the solid line into a clean outline (grown shape minus the shape), which
       avoids the stray lines that text-stroke draws where a variable font's contours overlap (R, V…).
       Accent letters are transparent here and drawn solid by the overlay line on top. */
    .sigbox { position: relative; }
    .sig--hollow { color: #fff; }
    .sig--hollow b { color: transparent; }
    .sig--accent { position: absolute; inset: 0; pointer-events: none; .gh { color: transparent; } }
    .defs { position: absolute; width: 0; height: 0; overflow: hidden; }
  `,
})
export class SignatureLine {
  /** Name used to find these letters from other sections (e.g. 'hero'). */
  readonly scope = input('footer');
  /** Outlined letters (used in the footer); the accent letters stay solid. */
  readonly hollow = input(false);
  /** Fitted font size, mirrored to the accent overlay. */
  protected readonly size = signal('');
  protected readonly words = WORDS;
  private readonly line = viewChild.required<ElementRef<HTMLElement>>('line');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.line().nativeElement;
      const fit = () => {
        el.style.fontSize = '100px';
        const natural = el.scrollWidth;
        const avail = el.parentElement?.clientWidth ?? el.clientWidth;
        if (natural > 0) el.style.fontSize = `${(100 * (avail - 1)) / natural}px`;
        this.size.set(el.style.fontSize);
        if (this.hollow()) el.style.filter = `url(#sig-outline-${this.scope()})`;
      };
      fit();
      document.fonts?.ready.then(fit);
      // Refit only when the available width changes (height changes from the refit itself are ignored).
      let lastW = 0;
      const ro = new ResizeObserver((entries) => {
        const w = Math.round(entries[0].contentRect.width);
        if (w === lastW) return;
        lastW = w;
        requestAnimationFrame(fit);
      });
      ro.observe(el.parentElement ?? el);
      destroyRef.onDestroy(() => ro.disconnect());
    });
  }
}
