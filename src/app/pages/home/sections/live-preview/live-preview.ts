import { ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';

type Tab = 'erp' | 'voice' | 'mobile';
interface Line { code: string; name: string; qty: number; rate: number; }
interface Msg { who: 'Agent' | 'Customer'; text: string; }

const CATALOGUE: Omit<Line, 'qty'>[] = [
  { code: '8901030', name: 'Steel water bottle 1L', rate: 420 },
  { code: '8901262', name: 'Notebook A5, ruled', rate: 85 },
  { code: '8904109', name: 'LED desk lamp', rate: 1290 },
  { code: '8901725', name: 'USB-C cable 1m', rate: 249 },
];

const CALL: Msg[] = [
  { who: 'Agent', text: 'Hello, this is a reminder from Your Business. Your invoice of ₹18,400 is due on Friday.' },
  { who: 'Customer', text: 'Can I pay on Monday instead?' },
  { who: 'Agent', text: "Sure. I've noted Monday. You'll get a payment link on WhatsApp now." },
];

import { MotionService } from '../../../../core/motion.service';

@Component({
  selector: 'app-live-preview',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './live-preview.html',
  styleUrl: './live-preview.scss',
})
export class LivePreview {
  private readonly motionSvc = inject(MotionService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private timers: ReturnType<typeof setTimeout>[] = [];

  protected readonly tab = signal<Tab>('voice');
  protected readonly tabs: { id: Tab; label: string }[] = [
    { id: 'erp', label: 'Barcode Billing & Inventory ERP' },
    { id: 'voice', label: 'AI Voice & Due-Date Reminder Agent' },
    { id: 'mobile', label: 'Mobile & Web App Portals' },
  ];

  /* ---- ERP demo ---- */
  protected readonly lines = signal<Line[]>([{ ...CATALOGUE[0], qty: 2 }, { ...CATALOGUE[1], qty: 5 }]);
  private next = 2;
  protected readonly subtotal = computed(() => this.lines().reduce((s, l) => s + l.qty * l.rate, 0));
  protected readonly gst = computed(() => Math.round(this.subtotal() * 0.18));
  protected readonly total = computed(() => this.subtotal() + this.gst());
  protected readonly bars = [42, 58, 51, 66, 72, 61, 84];
  protected readonly stock = [
    { name: 'Steel water bottle 1L', qty: 42, low: false },
    { name: 'LED desk lamp', qty: 6, low: true },
    { name: 'USB-C cable 1m', qty: 118, low: false },
  ];

  /* Call log for the reminder agent */
  protected readonly calls = [
    { who: 'Customer 0142', due: '₹18,400', status: 'Promised Monday', tone: 'ok' },
    { who: 'Customer 0097', due: '₹6,250', status: 'Paid via link', tone: 'done' },
    { who: 'Customer 0210', due: '₹12,900', status: 'Call back 5 pm', tone: 'wait' },
    { who: 'Customer 0033', due: '₹3,180', status: 'Handed to staff', tone: 'wait' },
  ];

  protected scan(): void {
    const item = CATALOGUE[this.next % CATALOGUE.length];
    this.next++;
    this.lines.update((ls) => {
      const found = ls.find((l) => l.code === item.code);
      return found ? ls.map((l) => (l === found ? { ...l, qty: l.qty + 1 } : l)) : [...ls, { ...item, qty: 1 }];
    });
  }
  protected clearInvoice(): void { this.lines.set([]); this.next = 0; }

  /* ---- Voice demo ---- */
  protected readonly wave = Array.from({ length: 48 }, (_, i) => 18 + Math.round(70 * Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.17))));
  protected readonly playing = signal(false);
  protected readonly shown = signal<Msg[]>(CALL);
  protected readonly scheduled = signal(true);

  protected playCall(): void {
    this.stopTimers();
    if (!this.isBrowser) return;
    const reduced = this.motionSvc.isReduced();
    if (reduced) { this.shown.set(CALL); this.scheduled.set(true); return; }
    this.shown.set([]); this.scheduled.set(false); this.playing.set(true);
    CALL.forEach((m, i) => this.timers.push(setTimeout(() => this.shown.update((s) => [...s, m]), 700 + i * 1800)));
    this.timers.push(setTimeout(() => { this.scheduled.set(true); this.playing.set(false); }, 700 + CALL.length * 1800));
  }

  /* ---- Mobile demo ---- */
  protected readonly screen = signal<'order' | 'track' | 'pay'>('order');
  protected readonly qty = signal(1);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stopTimers());
  }

  private stopTimers(): void { this.timers.forEach(clearTimeout); this.timers = []; this.playing.set(false); }

  protected select(t: Tab): void { this.stopTimers(); this.shown.set(CALL); this.scheduled.set(true); this.tab.set(t); }
  protected onTabKey(e: KeyboardEvent, i: number): void {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (i + dir + this.tabs.length) % this.tabs.length;
    this.select(this.tabs[n].id);
    (document.getElementById('lp-tab-' + this.tabs[n].id) as HTMLElement | null)?.focus();
  }
}
