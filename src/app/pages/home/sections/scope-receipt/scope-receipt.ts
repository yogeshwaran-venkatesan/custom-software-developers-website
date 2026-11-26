import { ChangeDetectionStrategy, Component, afterNextRender, computed, input, signal } from '@angular/core';
import { SITE, whatsappUrl } from '../../../../core/site.config';

interface Module { id: string; label: string; detail: string; weeks: [number, number]; }

/** Indicative build times in weeks (owner to confirm). Shown on the receipt as estimates, not a quote. */
const MODULES: Module[] = [
  { id: 'web', label: 'Websites', detail: 'Custom website or landing page', weeks: [2, 3] },
  { id: 'app', label: 'Mobile Apps', detail: 'iOS + Android app', weeks: [6, 10] },
  { id: 'erp', label: 'ERP / Billing', detail: 'Barcode billing, stock, GST', weeks: [6, 12] },
  { id: 'ai', label: 'AI Voice / Chat Agents', detail: 'Voice or chat agent', weeks: [3, 6] },
  { id: 'int', label: 'Integrations', detail: 'Payments, WhatsApp, Tally, APIs', weeks: [1, 2] },
];
const TIMELINES = ['As soon as possible', '1 to 3 months', '3 to 6 months', 'Flexible'];
const TICKER = ['Custom websites', 'AI voice agents', 'Due-date reminder callers', 'iOS & Android apps', 'Barcode billing',
  'GST invoicing', 'Inventory & stock', 'Multi-branch dashboards', 'SaaS MVPs', 'WhatsApp integrations', 'Source code ownership', 'AMC support'];

/**
 * Scrolling capability ticker + "Live Project Scope Receipt".
 * Left: module and timeline toggles. Right: a warm paper receipt that updates live (line items, an indicative
 * timeline, 100% source code ownership included) and exports the scope to WhatsApp or email. Nothing is sent
 * automatically; the visitor's own WhatsApp or email app opens with the text filled in.
 */
@Component({
  selector: 'app-scope-receipt',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="sr" id="scope" aria-labelledby="sr-title">
      @if (showTicker()) {
        <div class="ticker" aria-hidden="true">
          <div class="ticker__track">
            @for (r of [0, 1]; track r) {
              @for (t of ticker; track t) { <span>{{ t }}</span><i>✦</i> }
            }
          </div>
        </div>
      }

      <div class="sr__in">
        <div class="cfg">
          <h2 id="sr-title" class="h-sec">Build your project scope.</h2>
          <p class="lead">Pick what you need. The receipt updates as you go, and you can send it to us in one tap.</p>

          <fieldset>
            <legend>What should we build?</legend>
            <div class="chips">
              @for (m of modules; track m.id) {
                <button type="button" class="chip" [attr.aria-pressed]="picked().includes(m.id)" (click)="toggle(m.id)">
                  <span class="box" aria-hidden="true"></span>{{ m.label }}
                </button>
              }
            </div>
          </fieldset>

          <fieldset>
            <legend>Target timeline</legend>
            <div class="chips">
              @for (t of timelines; track t) {
                <button type="button" class="chip chip--radio" [attr.aria-pressed]="timeline() === t" (click)="timeline.set(t)">{{ t }}</button>
              }
            </div>
          </fieldset>

          <div class="fields">
            <label><span class="lb">Your name <i>(optional)</i></span>
              <input type="text" autocomplete="name" maxlength="80" [value]="name()" (input)="name.set(val($event))" />
            </label>
            <label><span class="lb">Anything we should know? <i>(optional)</i></span>
              <textarea rows="3" maxlength="800" [value]="notes()" (input)="notes.set(val($event))"></textarea>
            </label>
          </div>
        </div>

        <div class="paper-wrap">
          <article class="receipt" aria-labelledby="rc-title" aria-live="polite">
            <header>
              <p id="rc-title" class="rc__brand">CUSTOM SOFTWARE DEVELOPERS</p>
              <p class="rc__meta">PROJECT SCOPE RECEIPT</p>
              <p class="rc__meta">NO. {{ ref() }} &nbsp; {{ today() }}</p>
            </header>
            <div class="rule"></div>
            @for (m of selected(); track m.id) {
              <div class="ln ln--in"><span>{{ m.label }}<small>{{ m.detail }}</small></span><b>{{ m.weeks[0] }}–{{ m.weeks[1] }} WK</b></div>
            } @empty {
              <p class="empty">Select the modules you need to start your scope.</p>
            }
            <div class="rule"></div>
            <div class="ln"><span>Target timeline</span><b>{{ timeline() || '—' }}</b></div>
            <div class="ln ln--tot"><span>Estimated build</span><b>{{ estimate() }}</b></div>
            @if (tight()) { <p class="warn">Tight for your target: we will suggest a phased launch.</p> }
            <div class="rule"></div>
            <div class="ln"><span>100% Source Code Ownership</span><b>INCLUDED</b></div>
            <div class="ln"><span>Milestone payments</span><b>INCLUDED</b></div>
            <div class="ln"><span>Post-launch AMC</span><b>AVAILABLE</b></div>
            <p class="fine">Indicative timeline, not a quote. We confirm scope and price after a short call.</p>
            <div class="barcode" aria-hidden="true"></div>
          </article>

          <div class="send">
            @if (error()) { <p class="err" role="alert">{{ error() }}</p> }
            @if (hasWhatsapp) {
              <button type="button" class="btn btn--wa" (click)="sendWhatsapp()">Send on WhatsApp</button>
            }
            <a class="btn btn--accent" [href]="emailHref()" (click)="checkEmail($event)">Email this scope</a>
          </div>
          <p class="to">Goes to {{ email }}</p>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .sr { background: var(--c-bg); border-top: 1px solid var(--c-border); padding-bottom: clamp(80px, 10vw, 136px); overflow: hidden; }
    .ticker { border-bottom: 1px solid var(--c-border); padding: 18px 0; overflow: hidden; white-space: nowrap;
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
    .ticker__track { display: inline-flex; align-items: center; gap: 28px; animation: marquee 48s linear infinite;
      span { font: 800 clamp(1.1rem, .8rem + 1vw, 1.6rem) var(--f-disp); letter-spacing: .02em; text-transform: uppercase; color: #fff; }
      i { font-style: normal; color: var(--c-accent); font-size: 14px; } }
    @keyframes marquee { to { transform: translateX(-50%); } }
    @media (prefers-reduced-motion: reduce) { :host-context(html:not(.motion-on)) .ticker__track { animation: none; } }

    .sr__in { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 460px); gap: clamp(40px, 6vw, 96px); align-items: start;
      padding: clamp(64px, 8vw, 104px) var(--pad-x) 0; }
    .lead { margin-top: 16px; color: var(--c-muted); max-width: 50ch; }
    fieldset { border: 0; margin: 36px 0 0; padding: 0; }
    legend { padding: 0; margin-bottom: 14px; font: 700 1.05rem var(--f-disp); }
    .chips { display: flex; flex-wrap: wrap; gap: 10px; }
    .chip { display: inline-flex; align-items: center; gap: 10px; min-height: 48px; padding: 0 18px; border-radius: 999px; cursor: pointer;
      border: 1px solid var(--c-border); background: var(--c-card); color: var(--c-muted); font: 500 14.5px var(--f-body);
      transition: border-color .2s, background-color .2s, color .2s;
      &:hover { border-color: #3a3733; color: #fff; }
      &[aria-pressed='true'] { border-color: var(--c-accent); background: var(--c-accent-soft); color: #fff; }
      .box { width: 18px; height: 18px; border-radius: 6px; border: 1.5px solid #4a4744; display: grid; place-items: center; }
      &[aria-pressed='true'] .box { background: var(--c-accent); border-color: var(--c-accent);
        &::after { content: '✓'; color: var(--c-on-accent); font-size: 12px; font-weight: 800; } } }
    .fields { margin-top: 36px; display: grid; gap: 16px; max-width: 560px;
      label { display: grid; gap: 8px; font-weight: 600; font-size: 14.5px; i { font-style: normal; font-weight: 400; color: var(--c-dim); } }
      input, textarea { width: 100%; padding: 14px 16px; border-radius: 16px; border: 1px solid var(--c-border); background: var(--c-card); color: #fff; font: 400 15px var(--f-body); resize: vertical;
        &:focus { outline: none; border-color: var(--c-accent); box-shadow: 0 0 0 3px var(--c-accent-soft); } } }

    .paper-wrap { position: sticky; top: calc(var(--header-h) + 16px); }
    .receipt { --ink: var(--c-paper-ink); background: var(--c-paper); color: var(--ink); padding: 28px 26px 40px; font: 500 13.5px/1.6 var(--f-mono);
      box-shadow: 0 40px 80px -30px rgba(0, 0, 0, .8), 0 0 0 1px rgba(255, 255, 255, .04);
      transform: rotate(-1deg);
      -webkit-mask: linear-gradient(#000, #000) top / 100% calc(100% - 10px) no-repeat, conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / 16px 10px repeat-x;
      mask: linear-gradient(#000, #000) top / 100% calc(100% - 10px) no-repeat, conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / 16px 10px repeat-x; }
    header { text-align: center; }
    .rc__brand { font: 800 15px var(--f-disp); letter-spacing: .04em; }
    .rc__meta { font-size: 12px; color: #5d5a54; letter-spacing: .06em; }
    .rule { border-top: 1.5px dashed #b9b4a8; margin: 14px 0; }
    .ln { display: flex; justify-content: space-between; gap: 14px; padding: 4px 0;
      span { text-transform: uppercase; letter-spacing: .02em; } small { display: block; text-transform: none; color: #6b675f; font-size: 12px; letter-spacing: 0; }
      b { flex: none; font-weight: 700; text-align: right; } }
    .ln--in { animation: print .45s var(--ease-out) both; }
    @keyframes print { from { opacity: 0; transform: translateY(-6px); clip-path: inset(0 0 100% 0); } to { opacity: 1; transform: none; clip-path: inset(0); } }
    .ln--tot { font-size: 15px; b { font-size: 15px; } }
    .empty { color: #6b675f; padding: 8px 0; }
    .warn { margin-top: 4px; font-size: 12px; color: #9a4b00; }
    .fine { margin-top: 14px; font-size: 11.5px; color: #6b675f; }
    .barcode { height: 40px; margin-top: 18px;
      background: repeating-linear-gradient(90deg, var(--ink) 0 2px, transparent 2px 4px, var(--ink) 4px 5px, transparent 5px 8px, var(--ink) 8px 11px, transparent 11px 13px); }
    .send { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 26px; .btn { flex: 1; } }
    .err { flex-basis: 100%; color: #ff9b6a; font-size: 14px; }
    .to { margin-top: 10px; font-size: 13px; color: var(--c-dim); text-align: center; overflow-wrap: anywhere; }

    @media (max-width: 1023px) {
      .sr__in { grid-template-columns: 1fr; }
      .paper-wrap { position: static; max-width: 460px; }
      .receipt { transform: none; }
    }
  `,
})
export class ScopeReceipt {
  /** Hide the ticker where the page already has a heading band (e.g. /contact). */
  readonly showTicker = input(true);

  protected readonly modules = MODULES;
  protected readonly timelines = TIMELINES;
  protected readonly ticker = TICKER;
  protected readonly email = SITE.email;
  protected readonly hasWhatsapp = !!SITE.whatsappNumber;

  protected readonly picked = signal<string[]>([]);
  protected readonly timeline = signal('');
  protected readonly name = signal('');
  protected readonly notes = signal('');
  protected readonly error = signal('');

  /** Filled in the browser so the prerendered page never shows a stale date. */
  protected readonly ref = signal('CSD-0001');
  protected readonly today = signal('');

  constructor() {
    afterNextRender(() => {
      const d = new Date();
      this.ref.set('CSD-' + String(d.getFullYear() % 100) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0'));
      this.today.set(d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase());
    });
  }

  protected readonly selected = computed(() => this.modules.filter((m) => this.picked().includes(m.id)));

  /** Longest module plus 30% of the others (parts run in parallel), as a week range. */
  private readonly weeks = computed<[number, number] | null>(() => {
    const sel = this.selected();
    if (!sel.length) return null;
    const range = (k: 0 | 1) => {
      const v = sel.map((m) => m.weeks[k]).sort((a, b) => b - a);
      return Math.round(v[0] + 0.3 * v.slice(1).reduce((s, x) => s + x, 0));
    };
    return [range(0), range(1)];
  });
  protected readonly estimate = computed(() => {
    const w = this.weeks();
    return w ? `${w[0]}–${w[1]} WEEKS` : '—';
  });
  /** True when the estimate is clearly longer than the chosen target. */
  protected readonly tight = computed(() => {
    const w = this.weeks();
    const t = this.timeline();
    if (!w || !t) return false;
    const limit = t === 'As soon as possible' ? 4 : t === '1 to 3 months' ? 13 : t === '3 to 6 months' ? 26 : Infinity;
    return w[0] > limit;
  });

  protected toggle(id: string): void {
    this.error.set('');
    this.picked.update((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  protected val(e: Event): string {
    return (e.target as HTMLInputElement | HTMLTextAreaElement).value;
  }

  private message(): string {
    const lines = this.selected().map((m) => `- ${m.label} (${m.weeks[0]}-${m.weeks[1]} weeks)`).join('\n');
    const parts = [
      "Hi, here is my project scope.", '', lines, '',
      `Target timeline: ${this.timeline() || 'not decided'}`,
      `Estimated build: ${this.estimate().replace('–', '-').toLowerCase()}`,
    ];
    if (this.notes().trim()) parts.push('', this.notes().trim());
    if (this.name().trim()) parts.push('', this.name().trim());
    return parts.join('\n');
  }

  private valid(): boolean {
    if (!this.picked().length) { this.error.set('Select at least one module first.'); return false; }
    this.error.set('');
    return true;
  }

  protected sendWhatsapp(): void {
    if (!this.valid()) return;
    const url = whatsappUrl(this.message());
    if (url) window.open(url, '_blank', 'noopener');
  }

  protected emailHref(): string {
    const subject = `Project scope: ${this.selected().map((m) => m.label).join(', ') || 'New project'}`;
    return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(this.message())}`;
  }

  protected checkEmail(e: Event): void {
    if (!this.valid()) e.preventDefault();
  }
}
