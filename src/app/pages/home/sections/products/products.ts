import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, input, signal } from '@angular/core';
import { MotionService } from '../../../../core/motion.service';
import { RouterLink } from '@angular/router';
import { SITE } from '../../../../core/site.config';

/** img: which showcase image; fx/fy: centre of the phone to zoom into (fraction of the image). */
const FEATURES = [
  { img: 'seettu-pro-member', fx: 0.5, fy: 0.62, title: 'Every month at a glance', body: 'Members see paid, overdue and upcoming months on one card, with balance and next due date.' },
  { img: 'seettu-pro-member', fx: 0.5, fy: 0.72, title: 'Pay by UPI', body: 'Members pay from the app and the shop sees it on the counter dashboard right away.' },
  { img: 'seettu-pro-member', fx: 0.82, fy: 0.5, title: 'Tamil and English', body: 'The whole app switches language in one tap, for members and staff.' },
  { img: 'seettu-pro-member', fx: 0.5, fy: 0.3, title: 'Safe handover', body: 'A private handover code and a QR card at the counter make sure goods go to the right member.' },
  { img: 'seettu-pro-owner', fx: 0.18, fy: 0.45, title: 'Rules your way', body: 'Grace days, late fees and on-time bonuses are set per scheme by the shop owner.' },
  { img: 'seettu-pro-owner', fx: 0.5, fy: 0.6, title: 'Verify and remind in one tap', body: 'Owners approve UPI payments as they arrive and send a reminder to every overdue member with one button.' },
];

const SHOTS = [
  {
    id: 'member', label: 'Member app', img: 'seettu-pro-member',
    caption: 'Member app · Android · English and Tamil',
    alt: 'Seettu Pro member app on three phones: the My cards list, a Deepavali 2027 card with monthly payment status and handover code, and the same list in Tamil',
  },
  {
    id: 'owner', label: 'Shop owner app', img: 'seettu-pro-owner',
    caption: 'Shop owner app · live collections, UPI verification, handover and reminders',
    alt: 'Seettu Pro shop owner app on three phones: the schemes list, a dashboard of this month\'s collections with verify UPI, handover and remind overdue buttons, and a member list with monthly payment status',
  },
] as const;

const DUES = [
  { name: 'Lakshmi A.', card: 'DE27-001', paid: 4, due: 'Overdue 3', late: true },
  { name: 'Murugan S.', card: 'DE27-014', paid: 7, due: 'Up to date', late: false },
  { name: 'Revathi K.', card: 'WG27-009', paid: 6, due: 'Due 2 Dec', late: false },
  { name: 'Selvam P.', card: 'DE27-022', paid: 5, due: 'Overdue 1', late: true },
];

@Component({
  selector: 'app-products',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  /** Hide the section title when the page hero already names the product. */
  readonly showHead = input(true);
  protected readonly features = FEATURES;
  /** Feature in focus in the scrollytelling block (desktop). */
  protected readonly feat = signal(0);
  protected readonly focus = computed(() => FEATURES[this.feat()]);

  constructor() {
    const motion = inject(MotionService);
    const host = inject(ElementRef<HTMLElement>);
    const destroyRef = inject(DestroyRef);
    afterNextRender(async () => {
      const kit = await motion.kit();
      if (!kit) return;
      const mm = kit.gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        const items = (host.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.story__list li');
        const triggers = [...items].map((li, i) =>
          kit.ScrollTrigger.create({ trigger: li, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => { if (s.isActive) this.feat.set(i); } }));
        return () => triggers.forEach((t) => t.kill());
      });
      destroyRef.onDestroy(() => mm.revert());
    });
  }
  protected readonly shots = SHOTS;
  protected readonly view = signal<'member' | 'owner'>('member');
  protected readonly shot = computed(() => SHOTS.find((s) => s.id === this.view())!);
  protected readonly dues = DUES;
  protected readonly demoMail =
    `mailto:${SITE.email}?subject=${encodeURIComponent('Seettu Pro demo')}&body=${encodeURIComponent('Hi, I run a shop with a savings scheme and would like a demo of Seettu Pro.\n\nShop name:\nCity:\nNumber of members (approx.):')}`;
}
