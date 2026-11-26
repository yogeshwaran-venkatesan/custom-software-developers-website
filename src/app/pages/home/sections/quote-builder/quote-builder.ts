import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { SITE, whatsappUrl } from '../../../../core/site.config';

const SCOPES = ['Website', 'AI solution', 'Mobile app', 'ERP / web app', 'Full custom system'];
const PILLARS = [
  { title: '100% source code ownership', body: 'The code, the database and the accounts are yours. No licence lock-in, no recurring SaaS fees to us.' },
  { title: 'Built strictly to your workflow', body: 'We fit the software to how your team works, not the other way round.' },
  { title: 'Dedicated post-launch AMC', body: 'Fixes, updates and new features from the same team that built it.' },
];

@Component({
  selector: 'app-quote-builder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quote-builder.html',
  styleUrl: './quote-builder.scss',
})
export class QuoteBuilder {
  protected readonly site = SITE;
  protected readonly scopes = SCOPES;
  protected readonly pillars = PILLARS;
  protected readonly hasWhatsapp = !!SITE.whatsappNumber;

  protected readonly picked = signal<string[]>([]);
  protected readonly name = signal('');
  protected readonly brief = signal('');
  protected readonly tried = signal(false);

  protected readonly scopeError = computed(() => (this.tried() && !this.picked().length ? 'Pick at least one thing you need.' : ''));
  protected readonly briefError = computed(() => {
    if (!this.tried()) return '';
    const len = this.brief().trim().length;
    if (!len) return 'Describe what you need in a sentence or two.';
    if (len < 15) return 'Add a little more detail, at least 15 characters.';
    return '';
  });

  toggle(s: string): void {
    this.picked.update((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  }

  private message(): string {
    const who = this.name().trim() ? `\n\n${this.name().trim()}` : '';
    return `Hi, I'd like a quote.\n\nNeed: ${this.picked().join(', ')}\n\n${this.brief().trim()}${who}`;
  }

  private valid(): boolean {
    this.tried.set(true);
    return !this.scopeError() && !this.briefError();
  }

  sendWhatsapp(): void {
    if (!this.valid()) return;
    const url = whatsappUrl(this.message());
    if (url) window.open(url, '_blank', 'noopener');
  }

  emailHref(): string {
    const subject = `Project brief: ${this.picked().join(', ') || 'New project'}`;
    return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(this.message())}`;
  }

  sendEmail(e: Event): void {
    if (!this.valid()) e.preventDefault();
  }

  onInput(e: Event, which: 'name' | 'brief'): void {
    const v = (e.target as HTMLInputElement | HTMLTextAreaElement).value.slice(0, which === 'brief' ? 1500 : 80);
    which === 'brief' ? this.brief.set(v) : this.name.set(v);
  }
}
