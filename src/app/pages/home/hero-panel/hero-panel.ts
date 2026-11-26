import {
  ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, afterNextRender, computed, inject, signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MotionService } from '../../../core/motion.service';

type Key = 'W' | 'A' | 'M' | 'E' | 'S';
/** A code token: [text, kind]. Kinds: c comment, k keyword, s string, n number, f function, p plain. */
type Tok = [string, 'c' | 'k' | 's' | 'n' | 'f' | 'p'];

interface Tab { key: Key; label: string; file: string; lines: Tok[][]; }

const kv = (k: string, v: string, kind: Tok[1]): Tok[] => [[`  ${k}: `, 'p'], [v, kind], [',', 'p']];

const TABS: Tab[] = [
  { key: 'W', label: 'Websites', file: 'website.config.ts', lines: [
    [['// your requirement, in code', 'c']],
    [['export const ', 'k'], ['site = ', 'p'], ['build', 'f'], ['({', 'p']],
    kv('type', "'website'", 's'), kv('pages', '6', 'n'), kv('seo', 'true', 'k'), kv('whatsapp', 'true', 'k'),
    [['});', 'p']],
  ] },
  { key: 'A', label: 'AI agents', file: 'agent.config.ts', lines: [
    [['// your requirement, in code', 'c']],
    [['export const ', 'k'], ['agent = ', 'p'], ['build', 'f'], ['({', 'p']],
    kv('type', "'voice-agent'", 's'), kv('languages', "['ta', 'ml', 'en']", 's'), kv('reminders', 'true', 'k'), kv('handoff', "'staff'", 's'),
    [['});', 'p']],
  ] },
  { key: 'M', label: 'Mobile', file: 'app.config.ts', lines: [
    [['// your requirement, in code', 'c']],
    [['export const ', 'k'], ['app = ', 'p'], ['build', 'f'], ['({', 'p']],
    kv('type', "'mobile-app'", 's'), kv('platforms', "['ios', 'android']", 's'), kv('offline', 'true', 'k'), kv('payments', "'upi'", 's'),
    [['});', 'p']],
  ] },
  { key: 'E', label: 'ERP & billing', file: 'billing.config.ts', lines: [
    [['// your requirement, in code', 'c']],
    [['export const ', 'k'], ['system = ', 'p'], ['build', 'f'], ['({', 'p']],
    kv('type', "'erp-billing'", 's'), kv('barcode', 'true', 'k'), kv('gst', 'true', 'k'), kv('branches', '3', 'n'),
    [['});', 'p']],
  ] },
  { key: 'S', label: 'SaaS', file: 'product.config.ts', lines: [
    [['// your requirement, in code', 'c']],
    [['export const ', 'k'], ['product = ', 'p'], ['build', 'f'], ['({', 'p']],
    kv('type', "'saas'", 's'), kv('tenants', "'many'", 's'), kv('billing', "'subscription'", 's'), kv('sourceCode', "'yours'", 's'),
    [['});', 'p']],
  ] },
];

/**
 * Hero "live build" panel: five service tabs (W A M E S). Each tab shows the requirement as a short config file
 * and a floating card with what gets delivered. Cycles on its own every few seconds until the visitor picks a tab;
 * no auto-cycling when reduced motion is on. Sample content only, no client names.
 */
@Component({
  selector: 'app-hero-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(mouseenter)': 'hover.set(true)', '(mouseleave)': 'hover.set(false)', '(focusin)': 'hover.set(true)', '(focusout)': 'hover.set(false)' },
  template: `
    <div class="tabs" role="tablist" aria-label="What we build">
      @for (t of tabs; track t.key; let i = $index) {
        <button type="button" role="tab" [id]="'hp-tab-' + t.key" [attr.aria-selected]="active() === i"
          [attr.aria-controls]="'hp-panel'" [attr.tabindex]="active() === i ? 0 : -1"
          (click)="pick(i)" (keydown)="onKey($event, i)"><b>{{ t.key }}</b>{{ t.label }}</button>
      }
    </div>

    <div class="stage" id="hp-panel" role="tabpanel" [attr.aria-labelledby]="'hp-tab-' + tab().key">
      <div class="code">
        <div class="code__top"><i></i><i></i><i></i><span>{{ tab().file }}</span></div>
        @for (t of [tab()]; track t.key) {
          <pre aria-label="Sample configuration"><code>@for (line of t.lines; track $index; let n = $index) {<span class="ln" [style.animation-delay.ms]="n * 90"><span class="num" aria-hidden="true">{{ n + 1 }}</span>@for (tok of line; track $index) {<span [class]="tok[1]">{{ tok[0] }}</span>}@if ($last) {<span class="cur" aria-hidden="true"></span>}</span>
}</code></pre>
        }
      </div>

      @for (t of [tab()]; track t.key) {
        <div class="res" aria-live="polite">
          @switch (t.key) {
            @case ('W') {
              <div class="res__h"><p class="res__t">Your website</p><span class="chip">Live</span></div>
              <p class="res__m">yourbusiness.in</p>
              <div class="site">
                <div class="site__bar"><i></i><i></i><i></i></div>
                <div class="site__body"><b>Welcome to your business</b><s></s><s class="short"></s><span class="site__btn">Book now</span></div>
                <div class="site__grid"><i></i><i></i><i></i></div>
              </div>
              <ul class="ticks"><li>Mobile ready</li><li>SEO ready</li><li>WhatsApp enquiries</li></ul>
            }
            @case ('A') {
              <div class="res__h"><p class="res__t">AI voice agent</p><span class="chip chip--live">On call</span></div>
              <p class="res__m">Payment reminder, 00:42</p>
              <div class="wave" aria-hidden="true">@for (h of wave; track $index) {<i [style.height.%]="h" [style.animation-delay.ms]="$index * 45"></i>}</div>
              <p class="bub">Hello! Your payment is due on Friday. Shall I send the link on WhatsApp?</p>
              <p class="bub bub--me">Yes, please send it.</p>
              <p class="ok">Payment link sent</p>
            }
            @case ('M') {
              <div class="res__h"><p class="res__t">Your app</p><span class="chip">iOS + Android</span></div>
              <p class="res__m">Order 0001</p>
              <ol class="track">
                <li class="done">Order confirmed</li><li class="done">Packed</li><li class="now">Out for delivery</li><li>Delivered</li>
              </ol>
              <span class="pill">Track order</span>
            }
            @case ('E') {
              <div class="res__h"><p class="res__t">Invoice 0001</p><span class="chip">Paid</span></div>
              <p class="res__m">Counter 1, today</p>
              <ul class="rows">
                <li><span class="ic">A</span><span class="nm">Item A<em>2 × ₹600</em></span><b>₹1,200</b></li>
                <li><span class="ic">B</span><span class="nm">Item B<em>1 × ₹450</em></span><b>₹450</b></li>
              </ul>
              <div class="tot"><span>Total incl. GST</span><b>₹1,732.50</b></div>
            }
            @case ('S') {
              <div class="res__h"><p class="res__t">Your product</p><span class="chip">This month</span></div>
              <p class="res__m">Admin dashboard</p>
              <div class="kpis"><p><small>Customers</small><b>128</b></p><p><small>Active plans</small><b>96</b></p></div>
              <div class="bars" aria-hidden="true">@for (b of bars; track $index) {<i [style.height.%]="b"></i>}</div>
            }
          }
        </div>
      }

      <div class="float f1" aria-hidden="true"><span class="dot">✓</span><span>Build passed<small>All checks green</small></span></div>
      <div class="float f2" aria-hidden="true"><span class="dot">{{ '{ }' }}</span><span>Source code handed over<small>The repository is yours</small></span></div>
    </div>
    <p class="note">Sample screens, for illustration.</p>
  `,
  styles: `
    :host { display: block; position: relative; }
    .tabs { position: relative; z-index: 3; display: inline-flex; flex-wrap: wrap; gap: 4px; padding: 5px; border-radius: 999px;
      background: rgba(20, 19, 18, .75); border: 1px solid var(--c-border); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
    .tabs button { display: inline-flex; align-items: center; gap: 7px; min-height: 38px; padding: 0 14px; border: 0; border-radius: 999px;
      background: transparent; color: var(--c-muted); font: 500 13.5px var(--f-body); cursor: pointer; transition: background-color .25s, color .25s;
      b { font: 800 13px var(--f-disp); color: #fff; }
      &:hover { color: #fff; }
      &[aria-selected='true'] { background: #fff; color: var(--c-paper-ink); box-shadow: 0 6px 18px -6px rgba(0, 0, 0, .6);
        b { color: #b86e0b; } } }

    .stage { position: relative; height: 470px; margin-top: 18px; perspective: 1600px; }
    .code { position: absolute; left: 0; top: 0; width: 84%; border-radius: 28px; overflow: hidden;
      background: linear-gradient(180deg, rgba(28, 26, 24, .9), rgba(20, 19, 18, .9)); border: 1px solid var(--c-border);
      backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
      box-shadow: 0 40px 80px -30px rgba(0, 0, 0, .85), inset 0 1px 0 rgba(255, 255, 255, .05);
      transform: rotateY(-6deg) rotateX(2deg); transform-origin: left center; }
    .code__top { display: flex; align-items: center; gap: 8px; padding: 15px 20px; border-bottom: 1px solid var(--c-border);
      i { width: 11px; height: 11px; border-radius: 50%; background: #2c2a27; }
      i:first-child { background: var(--c-accent); }
      span { margin-left: 12px; padding: 5px 12px; border-radius: 9px; background: rgba(255, 255, 255, .05); font: 500 12.5px var(--f-mono); color: var(--c-muted); } }
    pre { margin: 0; padding: 20px 22px 28px; font: 450 14.5px/1.85 var(--f-mono); color: #edebe8; min-height: 300px; white-space: normal; overflow: hidden; }
    .ln { display: block; white-space: pre; animation: line-in .5s var(--ease-out) both; }
    .num { display: inline-block; width: 28px; color: #4a4744; }
    .c { color: #6e6a66; } .k { color: var(--c-accent); } .s { color: #f5f2eb; } .n { color: #ffcf8a; } .f { color: var(--c-muted); }
    .cur { display: inline-block; width: 2px; height: 17px; margin-left: 3px; vertical-align: -3px; background: var(--c-accent);
      box-shadow: 0 0 10px var(--c-accent); animation: blink 1s steps(1) infinite; }
    @keyframes line-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: none; } }
    @keyframes blink { 50% { opacity: 0; } }

    .res { position: absolute; right: 0; bottom: 0; width: 56%; min-height: 250px; padding: 22px; border-radius: 26px; z-index: 2;
      background: linear-gradient(180deg, #1c1b19, #141312); border: 1px solid #33302c; color: #fff;
      box-shadow: 0 50px 90px -30px rgba(0, 0, 0, .9), 0 30px 80px -40px rgba(242, 163, 58, .5);
      animation: card-in .55s var(--ease-out) both; }
    @keyframes card-in { from { opacity: 0; transform: translateY(16px) scale(.98); } to { opacity: 1; transform: none; } }
    .res__h { display: flex; align-items: center; justify-content: space-between; gap: 12px;
      .res__t { font: 700 16px var(--f-disp); letter-spacing: -.01em; line-height: 1.2; } }
    .res__m { margin-top: 3px; font-size: 12.5px; color: var(--c-dim); }
    .chip { flex: none; font: 600 11.5px var(--f-body); padding: 5px 10px; border-radius: 999px; background: var(--c-accent-soft); color: var(--c-accent); }
    .chip--live::before { content: ''; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--c-accent); margin-right: 6px; vertical-align: 1px; }

    .rows { list-style: none; margin: 16px 0 0; padding: 0; display: grid; gap: 10px;
      li { display: flex; align-items: center; gap: 12px; font-size: 14px; }
      .ic { flex: none; width: 34px; height: 34px; border-radius: 10px; background: rgba(255, 255, 255, .05); display: grid; place-items: center; font: 700 12px var(--f-disp); color: var(--c-muted); }
      .nm { flex: 1; } em { display: block; font-style: normal; font-size: 12px; color: var(--c-dim); }
      b { font-weight: 600; font-variant-numeric: tabular-nums; } }
    .tot { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--c-border); display: flex; justify-content: space-between; align-items: baseline;
      span { color: var(--c-muted); font-size: 13.5px; } b { font: 800 24px var(--f-disp); letter-spacing: -.02em; } }

    .site { margin-top: 14px; border: 1px solid var(--c-border); border-radius: 14px; overflow: hidden; background: rgba(255, 255, 255, .02); }
    .site__bar { display: flex; gap: 5px; padding: 8px 10px; border-bottom: 1px solid var(--c-border); i { width: 7px; height: 7px; border-radius: 50%; background: #3a3733; } }
    .site__body { padding: 14px 12px 10px; b { display: block; font: 800 16px/1.15 var(--f-disp); letter-spacing: -.02em; }
      s { display: block; height: 6px; margin-top: 8px; width: 85%; border-radius: 3px; background: #2c2a27; } s.short { width: 55%; } }
    .site__btn { display: inline-block; margin-top: 10px; padding: 6px 12px; border-radius: 999px; background: var(--c-accent); color: var(--c-on-accent); font: 600 11px var(--f-body); }
    .site__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; padding: 0 12px 12px; i { height: 30px; border-radius: 6px; background: #22201e; } }
    .ticks { list-style: none; margin: 12px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 12.5px; color: var(--c-muted);
      li::before { content: '✓'; color: var(--c-accent); margin-right: 6px; } }

    .wave { display: flex; align-items: center; gap: 3px; height: 44px; margin: 12px 0 10px;
      i { flex: 1; border-radius: 2px; background: var(--c-accent); transform-origin: center; animation: wv 1s ease-in-out infinite alternate; } }
    @keyframes wv { from { transform: scaleY(.45); } to { transform: scaleY(1); } }
    .bub { max-width: 90%; padding: 8px 11px; border-radius: 12px; background: rgba(255, 255, 255, .06); font-size: 13px; line-height: 1.45; margin-bottom: 7px; }
    .bub--me { margin-left: auto; width: fit-content; background: var(--c-accent-soft); }
    .ok { font-size: 12.5px; color: var(--c-muted); &::before { content: '✓'; color: var(--c-accent); margin-right: 6px; } }

    .track { list-style: none; margin: 14px 0 0; padding: 0; display: grid; gap: 10px; font-size: 13.5px;
      li { position: relative; padding-left: 22px; color: var(--c-dim); }
      li::before { content: ''; position: absolute; left: 0; top: 5px; width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid #4a4744; }
      li.done { color: #fff; } li.done::before { background: #fff; border-color: #fff; }
      li.now { color: #fff; font-weight: 600; } li.now::before { background: var(--c-accent); border-color: var(--c-accent); box-shadow: 0 0 0 5px var(--c-accent-soft); } }
    .pill { display: inline-block; margin-top: 14px; padding: 8px 16px; border-radius: 999px; background: #fff; color: var(--c-paper-ink); font: 600 12.5px var(--f-body); }

    .kpis { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 14px 0 12px;
      p { padding: 10px 12px; border-radius: 12px; border: 1px solid var(--c-border); } small { display: block; font-size: 11.5px; color: var(--c-dim); }
      b { font: 800 20px var(--f-disp); } }
    .bars { display: flex; align-items: flex-end; gap: 6px; height: 64px; border-bottom: 1px solid var(--c-border);
      i { flex: 1; border-radius: 4px 4px 0 0; background: #2c2a27; } i:last-child { background: var(--c-accent); } }

    .float { position: absolute; z-index: 4; display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 16px;
      background: rgba(20, 19, 18, .88); border: 1px solid var(--c-border); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      font-size: 13px; line-height: 1.3; box-shadow: 0 20px 40px -20px rgba(0, 0, 0, .85);
      small { display: block; color: var(--c-dim); font-size: 11.5px; } }
    .dot { flex: none; width: 28px; height: 28px; border-radius: 9px; display: grid; place-items: center; background: var(--c-accent-soft); color: var(--c-accent); font: 700 12px var(--f-body); }
    .f1 { right: 2%; top: -14px; }
    .f2 { left: -18px; bottom: 34px; }
    .note { margin-top: 10px; font-size: 12px; color: var(--c-dim); text-align: right; }

    @media (max-width: 1279px) { .f2 { display: none; } }
    @media (max-width: 1023px) {
      .stage { height: auto; perspective: none; }
      .code { position: relative; width: 100%; transform: none; }
      pre { min-height: 0; font-size: 13px; }
      .res { position: relative; width: auto; margin: -36px 12px 0; min-height: 0; }
      .f1, .f2 { display: none; }
      .tabs { display: flex; flex-wrap: nowrap; overflow-x: auto; max-width: 100%; scrollbar-width: none; border-radius: 22px;
        button { flex: none; } }
      .note { text-align: left; }
    }
  `,
})
export class HeroPanel {
  private readonly motion = inject(MotionService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly tabs = TABS;
  protected readonly active = signal(3);
  protected readonly tab = computed(() => this.tabs[this.active()]);
  protected readonly hover = signal(false);
  protected readonly wave = Array.from({ length: 26 }, (_, i) => 25 + Math.round(70 * Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23))));
  protected readonly bars = [35, 48, 42, 60, 55, 72, 88];
  private userPicked = false;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (!this.isBrowser || this.motion.isReduced()) return;
      const id = setInterval(() => {
        if (this.userPicked || this.hover() || document.hidden) return;
        this.active.update((i) => (i + 1) % this.tabs.length);
      }, 5200);
      destroyRef.onDestroy(() => clearInterval(id));
    });
  }

  protected pick(i: number): void {
    this.userPicked = true;
    this.active.set(i);
  }

  protected onKey(e: KeyboardEvent, i: number): void {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (i + dir + this.tabs.length) % this.tabs.length;
    this.pick(n);
    (document.getElementById('hp-tab-' + this.tabs[n].key) as HTMLElement | null)?.focus();
  }
}
