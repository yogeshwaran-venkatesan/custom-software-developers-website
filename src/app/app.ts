import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeader } from './layout/site-header/site-header';
import { SiteFooter } from './layout/site-footer/site-footer';
import { MobileBar } from './layout/mobile-bar/mobile-bar';
import { SeoService } from './core/seo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter, MobileBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#main">Skip to content</a>
    <app-site-header />
    <main id="main" tabindex="-1"><router-outlet /></main>
    <app-site-footer />
    <app-mobile-bar />
  `,
})
export class App {
  constructor() {
    inject(SeoService).init();
  }
}
