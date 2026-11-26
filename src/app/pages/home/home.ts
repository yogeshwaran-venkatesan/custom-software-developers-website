import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, WritableSignal, afterNextRender, inject, signal } from '@angular/core';
import { SignatureLine } from '../../shared/signature-line/signature-line';
import { MotionService } from '../../core/motion.service';
import { ServicesArc } from './sections/services-arc/services-arc';
import { ThreeActs } from './sections/three-acts/three-acts';
import { LivePreview } from './sections/live-preview/live-preview';
import { WorkPreview } from './sections/work-preview/work-preview';
import { ScopeReceipt } from './sections/scope-receipt/scope-receipt';
import { HeroPanel } from './hero-panel/hero-panel';
import { FLAGS } from '../../core/site.config';

@Component({
  selector: 'app-home',
  imports: [SignatureLine, ServicesArc, ThreeActs, LivePreview, WorkPreview, ScopeReceipt, HeroPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  /** Client work section, hidden until real case studies are ready (FLAGS.showWork). */
  protected readonly showWork = FLAGS.showWork;
  private readonly motion = inject(MotionService);
  private readonly host = inject(ElementRef<HTMLElement>);

  /** Right-edge scroll progress: one dot per main section. */
  protected readonly rail = [
    { id: 'top', label: 'Top' },
    { id: 'services', label: 'Services' },
    { id: 'preview', label: 'Live demos' },
    { id: 'scope', label: 'Project scope' },
  ];
  protected readonly railOn = signal(0);

  /** Hero heading, split into words so each can rise in on load. */
  protected readonly lineA = ['You', 'focus', 'on', 'growth.'];
  protected readonly lineB = ['We', 'handle', 'the', 'code.'];

  /** Terminal line under the heading: full trust statements, typed one after another. */
  protected readonly quotes = [
    'Your vision is safe in our hands.',
    'We bring your idea to life. We build what lasts.',
    'Your trust is our responsibility.',
  ];
  protected readonly quote = signal('');
  protected readonly quoteTyping = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const root = this.host.nativeElement as HTMLElement;
      root.querySelector('.hero')?.setAttribute('id', 'top');

      // Rail: highlight the section in view.
      const ids = this.rail.map((r) => r.id);
      const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) this.railOn.set(ids.indexOf(e.target.id));
      }, { rootMargin: '-45% 0px -50% 0px' });
      els.forEach((el) => io.observe(el));
      destroyRef.onDestroy(() => io.disconnect());

      // Terminal starts printing once the heading words have landed (about 1.6 s).
      this.typewriter(destroyRef, this.quotes, this.quote, this.quoteTyping, { type: [45, 75], back: 18, hold: 2800, delay: 1600 });

      // The load sequence is pure CSS (home.scss) so it plays at first paint, before the animation libraries load.
    });
  }

  /**
   * Types phrases one after another with human-like timing, starting from an empty line.
   * Pauses while the tab is hidden; with reduced motion the first phrase is shown as plain text.
   */
  private typewriter(
    destroyRef: DestroyRef, list: string[], text: WritableSignal<string>, busy: WritableSignal<boolean>,
    o: { type: [number, number]; back: number; hold: number; delay?: number },
  ): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { text.set(list[0]); return; }
    let timer = 0;
    let alive = true;
    destroyRef.onDestroy(() => { alive = false; clearTimeout(timer); });
    const wait = (ms: number) => new Promise<void>((r) => { timer = window.setTimeout(r, ms); });

    const typeIn = async (t: string) => {
      busy.set(true);
      for (let n = 1; n <= t.length && alive; n++) {
        text.set(t.slice(0, n));
        await wait(o.type[0] + Math.random() * (o.type[1] - o.type[0]));
      }
      busy.set(false);
    };

    const run = async () => {
      let i = 0;
      await wait(o.delay ?? 0);
      await typeIn(list[0]);
      while (alive) {
        await wait(o.hold);
        while (alive && document.hidden) await wait(500);
        const cur = list[i];
        busy.set(true);
        for (let n = cur.length - 1; n >= 0 && alive; n--) { text.set(cur.slice(0, n)); await wait(o.back); }
        busy.set(false);
        await wait(380);
        i = (i + 1) % list.length;
        await typeIn(list[i]);
      }
    };
    void run();
  }

  protected scrollTo(id: string, e: Event): void {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    if (id === 'top') { this.motion.scrollToY(0); return; }
    this.motion.scrollTo(el);
  }
}
