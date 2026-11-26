import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandLogo } from '../../shared/brand-logo/brand-logo';
import { SignatureLine } from '../../shared/signature-line/signature-line';
import { LEGAL_NAV, MAIN_NAV, PRODUCT_LINK, SERVICES, SITE, whatsappUrl } from '../../core/site.config';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, BrandLogo, SignatureLine],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  protected readonly site = SITE;
  protected readonly services = SERVICES.filter((s, i, all) => all.findIndex((x) => x.path === s.path) === i);
  protected readonly company = [...MAIN_NAV.filter((l) => l.path !== '/services'), PRODUCT_LINK];
  protected readonly legal = LEGAL_NAV;
  protected readonly wa = whatsappUrl();
  protected readonly year = new Date().getFullYear();
}
