import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

interface WorkItem {
  kind: string; title: string; challenge: string; architecture: string; outcome: string;
  /** Live demo URL: shows a browser frame with "Open live demo". */
  demoUrl?: string; domain?: string;
  /** Photo for typical-project examples without a live demo. */
  img?: string; alt?: string; pos?: string;
  label: 'Live demo' | 'Typical project';
}

/**
 * Case studies: Business Challenge, Custom Architecture, Measurable Outcome.
 * The two live demos are concept builds made for prospective clients; replace the typical-project examples
 * with real client case studies (with real numbers) as soon as they are available.
 */
const WORK: WorkItem[] = [
  {
    label: 'Live demo', kind: 'Website, interior design studio', title: 'Surabhi Modules: a showroom you can scroll through',
    challenge: 'An interior and modular-kitchen studio in Kochi needed its website to feel as premium as its work, and to turn visits into consultation requests.',
    architecture: 'Custom-coded landing site with a 3D scroll experience, fast image loading, mobile-first layout and WhatsApp enquiry buttons.',
    outcome: 'A live concept site the studio can open on any phone today, with every section leading to a consultation enquiry.',
    demoUrl: 'https://surabhi-modules-tryi.vercel.app/', domain: 'surabhi-modules-tryi.vercel.app',
  },
  {
    label: 'Live demo', kind: 'Website, safety equipment and training', title: 'Alan Global Safety: one site in three languages',
    challenge: 'A safety equipment and training company serving Kerala and Tamil Nadu needed one site its customers could read in their own language.',
    architecture: 'Multilingual website in English, Malayalam and Tamil, with product and training sections, smooth animation and enquiry forms.',
    outcome: 'A live concept site with full content in all three languages, switchable from any page.',
    demoUrl: 'https://alan-global-safety.vercel.app/', domain: 'alan-global-safety.vercel.app',
  },
  {
    label: 'Typical project', kind: 'ERP and billing', title: 'Multi-branch billing and inventory',
    challenge: 'Each branch kept its own stock sheet, so nobody knew the real stock or daily sales.',
    architecture: 'Barcode billing with GST invoices, central inventory, role-based access and a live owner dashboard.',
    outcome: 'One live view of stock and sales across branches, and invoices in seconds at the counter.',
    img: 'office-night', alt: 'A laptop with code on a desk in a quiet office at night', pos: '72% center',
  },
];

@Component({
  selector: 'app-work-preview',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="wk" id="work" aria-labelledby="wk-title">
      <div class="wk__head">
        <h2 id="wk-title" class="h-sec">{{ showAll() ? 'Selected work and live demos' : 'Projects' }}</h2>
        @if (showAll()) { <a class="btn btn--ghost-dark btn--sm" routerLink="/work">All work</a> }
      </div>
      <div class="grid">
        @for (w of work; track w.title) {
          <article class="case">
            @if (w.demoUrl) {
              <a class="case__vis case__vis--demo" [href]="w.demoUrl" target="_blank" rel="noopener" [attr.aria-label]="'Open live demo: ' + w.title">
                <span class="bar" aria-hidden="true"><i></i><i></i><i></i><em>{{ w.domain }}</em></span>
                <span class="big" aria-hidden="true">{{ w.title.split(':')[0] }}</span>
              </a>
            } @else {
              <picture class="case__vis">
                <source [srcset]="'/img/' + w.img + '.webp'" type="image/webp" />
                <img [src]="'/img/' + w.img + '.jpg'" [alt]="w.alt" width="1376" height="768" loading="lazy" [style.object-position]="w.pos ?? 'center'" />
              </picture>
            }
            <div class="case__tx">
              <p class="kind"><span class="tag" [class.tag--live]="!!w.demoUrl">{{ w.label }}</span>{{ w.kind }}</p>
              <h3>{{ w.title }}</h3>
              <dl>
                <div><dt>Business challenge</dt><dd>{{ w.challenge }}</dd></div>
                <div><dt>Custom architecture</dt><dd>{{ w.architecture }}</dd></div>
                <div><dt>Outcome</dt><dd>{{ w.outcome }}</dd></div>
              </dl>
              @if (w.demoUrl) {
                <a class="btn btn--accent btn--sm" [href]="w.demoUrl" target="_blank" rel="noopener">Open live demo</a>
              } @else {
                <a class="btn btn--ghost btn--sm" routerLink="/contact">Ask for a walkthrough</a>
              }
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .wk { background: var(--c-bg); padding: clamp(80px, 10vw, 136px) var(--pad-x); border-top: 1px solid var(--c-border); }
    .wk__head { display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between; align-items: flex-end; margin-bottom: 40px;
      h2 { max-width: 16ch; } }
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(14px, 1.6vw, 22px); }
    .case { display: flex; flex-direction: column; background: var(--c-card); border: 1px solid var(--c-border); border-radius: 28px; overflow: hidden;
      transition: border-color .3s, transform .4s var(--ease-out); &:hover { border-color: #3a3733; } }
    .case__vis { display: block; height: 220px; img { width: 100%; height: 100%; object-fit: cover; } }
    .case__vis--demo { position: relative; margin: 12px 12px 0; border-radius: 18px; overflow: hidden; text-decoration: none; color: #fff;
      background: radial-gradient(80% 90% at 80% 10%, rgba(242, 163, 58, .35), transparent 60%), linear-gradient(160deg, #1f1c18, #0f0e0d);
      border: 1px solid var(--c-border); height: 208px;
      .bar { display: flex; align-items: center; gap: 6px; padding: 10px 12px; border-bottom: 1px solid rgba(255, 255, 255, .08); background: rgba(0, 0, 0, .25);
        i { width: 8px; height: 8px; border-radius: 50%; background: #3a3733; }
        em { margin-left: 8px; font: 500 11.5px var(--f-mono); font-style: normal; color: var(--c-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } }
      .big { position: absolute; left: 18px; right: 18px; bottom: 16px; font: 800 clamp(1.6rem, 1rem + 1.4vw, 2.3rem)/1 var(--f-disp); letter-spacing: -.03em; }
      &:hover .big { color: var(--c-accent); } }
    .case__tx { flex: 1; padding: 24px 24px 28px; display: flex; flex-direction: column; gap: 14px; align-items: flex-start;
      h3 { font-size: 1.3rem; line-height: 1.2; } .btn { margin-top: auto; } }
    .kind { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; color: var(--c-dim); font-size: 13px; }
    .tag { padding: 4px 10px; border-radius: 999px; background: rgba(255, 255, 255, .06); color: var(--c-muted); font-weight: 600; font-size: 12px;
      &--live { background: var(--c-accent-soft); color: var(--c-accent); } }
    dl { margin: 0; display: grid; width: 100%; }
    dl div { border-top: 1px solid var(--c-border); padding: 12px 0; }
    dt { font: 600 12.5px var(--f-body); color: var(--c-accent); margin-bottom: 4px; }
    dd { margin: 0; color: var(--c-muted); font-size: 14.5px; line-height: 1.55; }
    @media (max-width: 1100px) { .grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
  `,
})
export class WorkPreview {
  /** Hide the "All work" link when already on /work. */
  readonly showAll = input(true);
  protected readonly work = WORK;
}
