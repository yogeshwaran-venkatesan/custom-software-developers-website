import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SITE } from './site.config';

const OG_IMAGE = '/img/og-image.jpg';

/**
 * SEO for every route (rendered into the prerendered HTML):
 * description, robots, canonical, Open Graph, Twitter card, and JSON-LD structured data.
 * Site-wide JSON-LD: Organization (ProfessionalService) + WebSite. Pages add their own blocks with setJsonLd()
 * (FAQPage from the FAQ component, Service + Breadcrumb from service pages); those are cleared on each navigation.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  init(): void {
    this.setJsonLd('org', ORG_LD, false);
    this.router.events.pipe(filter((e) => e instanceof NavigationStart)).subscribe(() => this.clearPageJsonLd());
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      let r = this.route;
      while (r.firstChild) r = r.firstChild;
      const data = r.snapshot.data ?? {};
      const path = this.router.url.split(/[?#]/)[0];
      const url = SITE.siteUrl + (path === '/' ? '/' : path);
      const title = this.doc.title;
      const desc = data['description'] ?? '';
      const image = SITE.siteUrl + OG_IMAGE;

      this.meta.updateTag({ name: 'description', content: desc });
      this.meta.updateTag({ name: 'robots', content: data['noindex'] ? 'noindex' : 'index,follow,max-image-preview:large' });
      this.meta.updateTag({ property: 'og:site_name', content: SITE.name });
      this.meta.updateTag({ property: 'og:locale', content: 'en_IN' });
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ property: 'og:description', content: desc });
      this.meta.updateTag({ property: 'og:url', content: url });
      this.meta.updateTag({ property: 'og:type', content: 'website' });
      this.meta.updateTag({ property: 'og:image', content: image });
      this.meta.updateTag({ property: 'og:image:width', content: '1200' });
      this.meta.updateTag({ property: 'og:image:height', content: '630' });
      this.meta.updateTag({ property: 'og:image:alt', content: 'Custom Software Developers: You focus on growth. We handle the code.' });
      this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.meta.updateTag({ name: 'twitter:title', content: title });
      this.meta.updateTag({ name: 'twitter:description', content: desc });
      this.meta.updateTag({ name: 'twitter:image', content: image });

      let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = this.doc.createElement('link');
        link.rel = 'canonical';
        this.doc.head.appendChild(link);
      }
      link.href = url;
    });
  }

  /** Adds or replaces a JSON-LD block in <head>. Page blocks (page = true) are removed on the next navigation. */
  setJsonLd(id: string, data: object, page = true): void {
    const sel = `script[type="application/ld+json"][data-ld="${id}"]`;
    let el = this.doc.head.querySelector<HTMLScriptElement>(sel);
    if (!el) {
      el = this.doc.createElement('script');
      el.type = 'application/ld+json';
      el.setAttribute('data-ld', id);
      if (page) el.setAttribute('data-ld-page', '');
      this.doc.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  }

  private clearPageJsonLd(): void {
    this.doc.head.querySelectorAll('script[data-ld-page]').forEach((el) => el.remove());
  }
}

/** Business details for search engines. Keep in sync with site.config.ts. */
const ORG_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': SITE.siteUrl + '/#org',
      name: SITE.name,
      url: SITE.siteUrl + '/',
      logo: SITE.siteUrl + '/img/logo-mark-96.png',
      image: SITE.siteUrl + OG_IMAGE,
      email: SITE.email,
      description: 'Custom websites, AI voice and chat agents, iOS and Android apps, ERP and billing systems, and SaaS products, built around your workflow with 100% source code ownership.',
      areaServed: 'IN',
      address: { '@type': 'PostalAddress', addressCountry: 'IN' },
      knowsAbout: ['Website development', 'AI voice agents', 'Mobile app development', 'ERP software', 'Billing software', 'SaaS development'],
    },
    {
      '@type': 'WebSite',
      '@id': SITE.siteUrl + '/#website',
      url: SITE.siteUrl + '/',
      name: SITE.name,
      publisher: { '@id': SITE.siteUrl + '/#org' },
      inLanguage: 'en-IN',
    },
  ],
};
