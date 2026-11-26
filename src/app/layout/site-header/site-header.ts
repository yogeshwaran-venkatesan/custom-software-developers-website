import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, PLATFORM_ID,
  afterNextRender, computed, inject, signal, viewChild,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrandLogo } from '../../shared/brand-logo/brand-logo';
import { MAIN_NAV, SITE } from '../../core/site.config';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, BrandLogo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  host: { '(document:keydown.escape)': 'closeMenu(true)' },
})
export class SiteHeader {
  protected readonly slogan = SITE.slogan;
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly menuBtn = viewChild<ElementRef<HTMLButtonElement>>('menuBtn');
  private readonly firstLink = viewChild<ElementRef<HTMLAnchorElement>>('firstLink');

  protected readonly nav = MAIN_NAV;
  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly onHome = signal(true);
  /** Transparent only on the home hero before scrolling. */
  protected readonly solid = computed(() => this.scrolled() || !this.onHome() || this.menuOpen());

  constructor() {
    const router = inject(Router);
    const destroyRef = inject(DestroyRef);
    this.onHome.set(router.url.split(/[?#]/)[0] === '/');
    router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd), takeUntilDestroyed(destroyRef))
      .subscribe((e) => {
        this.onHome.set(e.urlAfterRedirects.split(/[?#]/)[0] === '/');
        this.closeMenu(false);
      });

    afterNextRender(() => {
      const onScroll = () => this.scrolled.set(window.scrollY > 24);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
    });
  }

  protected toggleMenu(): void {
    this.menuOpen() ? this.closeMenu(true) : this.openMenu();
  }

  private openMenu(): void {
    this.menuOpen.set(true);
    if (this.isBrowser) {
      this.doc.body.style.overflow = 'hidden';
      setTimeout(() => this.firstLink()?.nativeElement.focus(), 0);
    }
  }

  protected closeMenu(returnFocus: boolean): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    if (this.isBrowser) {
      this.doc.body.style.overflow = '';
      if (returnFocus) this.menuBtn()?.nativeElement.focus();
    }
  }
}
