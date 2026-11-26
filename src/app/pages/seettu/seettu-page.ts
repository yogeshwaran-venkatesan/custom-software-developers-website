import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/site.config';
import { PageHero } from '../../shared/page-hero/page-hero';
import { Faq } from '../../shared/faq/faq';
import { Products } from '../home/sections/products/products';

const FAQS = [
  { q: 'Who is Seettu Pro for?', a: 'Jewellery shops, textile shops and other stores that run monthly savings schemes such as Deepavali or festival seettu.' },
  { q: 'Do members need to install anything?', a: 'Members use the Android app to see their card, pay by UPI and get reminders. The shop uses the counter dashboard and the owner app.' },
  { q: 'Can it carry our shop name and logo?', a: 'Yes. Join the shared Seettu Pro app on a monthly plan, or get your own branded app with your shop name and logo.' },
  { q: 'Can we move our existing members?', a: 'Yes. We import your member list and paid months from your register or Excel sheet before you go live.' },
  { q: 'Is it available in Tamil?', a: 'Yes. Members and staff can switch between Tamil and English in one tap.' },
];

@Component({
  selector: 'app-seettu-page',
  imports: [RouterLink, PageHero, Faq, Products],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero kicker="Our own product" title="Seettu Pro, the savings-scheme app for shops"
      intro="Members track and pay their Deepavali and festival seettu cards on their phone, in Tamil or English. The shop runs every scheme from the counter dashboard.">
      <a class="btn btn--accent" [href]="demoMail">Book a demo</a>
      <a class="btn btn--ghost" [routerLink]="[]" fragment="products">See the apps</a>
    </app-page-hero>
    <app-products [showHead]="false" />
    <app-faq [items]="faqs" title="Seettu Pro questions" />
  `,
  styles: `:host { display: block; } app-products { scroll-margin-top: var(--header-h); }`,
})
export class SeettuPage {
  protected readonly faqs = FAQS;
  protected readonly demoMail = `mailto:${SITE.email}?subject=${encodeURIComponent('Seettu Pro demo')}`;
}
