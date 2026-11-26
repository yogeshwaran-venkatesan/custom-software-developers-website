import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Dark hero used at the top of every inner page. Optional photo sits on the right on desktop. */
@Component({
  selector: 'app-page-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="ph" [class.ph--img]="!!img()">
      <div class="ph__in">
        <p class="mono ph__k">{{ kicker() }}</p>
        <h1>{{ cleanTitle() }}<i class="sq"></i></h1>
        <p class="ph__intro">{{ intro() }}</p>
        <div class="ph__cta"><ng-content /></div>
      </div>
      @if (img(); as im) {
        <picture class="ph__img">
          <source [srcset]="'/img/' + im + '.webp'" type="image/webp" />
          <img [src]="'/img/' + im + '.jpg'" [alt]="imgAlt()" width="1376" height="768" fetchpriority="high" />
        </picture>
      }
    </section>
  `,
  styles: `
    :host { display: block; }
    .ph {
      position: relative; overflow: hidden; color: #fff;
      background: radial-gradient(55% 60% at 15% 20%, rgba(242, 163, 58, .13), transparent 70%), var(--c-char);
      padding: calc(var(--header-h) + clamp(56px, 8vw, 104px)) var(--pad-x) clamp(64px, 8vw, 104px);
      display: grid; gap: clamp(32px, 5vw, 64px); align-items: center;
      &::before {
        content: ''; position: absolute; inset: 0; pointer-events: none; opacity: .3;
        background-image: linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px);
        background-size: 64px 64px; mask-image: radial-gradient(70% 80% at 20% 30%, #000 10%, transparent 70%);
      }
      > * { position: relative; }
    }
    .ph--img { grid-template-columns: 1.1fr 1fr; }
    .ph__k { color: var(--c-accent); }
    h1 { font-size: clamp(2.5rem, 1rem + 4.4vw, 5rem); line-height: 1.02; margin: 18px 0 20px; max-width: 17ch; text-wrap: balance; }
    .ph__intro { color: var(--c-muted); max-width: 58ch; font-size: 1.1rem; }
    .ph__cta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; &:empty { display: none; } }
    .ph__img { border-radius: 22px; overflow: hidden; border: 1px solid rgba(255,255,255,.1); aspect-ratio: 4 / 3;
      img { width: 100%; height: 100%; object-fit: cover; } }
    @media (max-width: 1023px) { .ph--img { grid-template-columns: 1fr; } .ph__img { aspect-ratio: 16 / 10; } }
  `,
})
export class PageHero {
  readonly kicker = input.required<string>();
  readonly title = input.required<string>();
  readonly intro = input('');
  readonly img = input<string>();
  readonly imgAlt = input('');
  /** The teal square is the full stop, so drop a trailing period from the text. */
  protected readonly cleanTitle = computed(() => this.title().replace(/\.\s*$/, ''));
}
