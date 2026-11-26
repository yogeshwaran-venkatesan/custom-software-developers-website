/** Single source of truth for brand, contact and navigation. Edit here, not in templates. */
export const SITE = {
  name: 'Custom Software Developers',
  shortTagline: 'You focus on growth. We handle the code.',
  /** Slogan under the header logo (hidden on small phones). */
  slogan: 'Build now. Grow forever.',
  /** Promise line under the footer logo (written in site-footer.html with "we can build it." in amber; keep both in sync). */
  footerSlogan: 'If you can imagine it, we can build it.',
  email: 'customsoftwaredevlopers@gmail.com',
  /**
   * WhatsApp number in international format, digits only (e.g. '919876543210').
   * While empty, WhatsApp buttons are hidden everywhere.
   */
  whatsappNumber: '',
  registration: 'Registered MSME (Udyam)',
  siteUrl: 'https://customsoftwaredevelopers.in',
} as const;

/**
 * Section switches. showWork: client work / case studies (home "Selected work", Work nav + footer links, /work cards).
 * Hidden for now (owner request, 26 Nov 2026); set to true to bring them back.
 */
export const FLAGS = {
  showWork: false,
} as const;

export interface NavLink {
  label: string;
  path: string;
}

export const MAIN_NAV: NavLink[] = [
  { label: 'Services', path: '/services' },
  ...(FLAGS.showWork ? [{ label: 'Work', path: '/work' }] : []),
  { label: 'Process', path: '/process' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

/** Our own product, linked from the footer (not part of the main nav). */
export const PRODUCT_LINK: NavLink = { label: 'Seettu Pro (our product)', path: '/products/seettu-pro' };

export interface ServiceLink extends NavLink {
  letter: 'W' | 'A' | 'M' | 'E' | 'S';
}

export const SERVICES: ServiceLink[] = [
  { letter: 'W', label: 'Websites & e-commerce', path: '/services/websites' },
  { letter: 'A', label: 'AI apps & voice agents', path: '/services/ai-solutions' },
  { letter: 'M', label: 'Mobile apps', path: '/services/mobile-apps' },
  { letter: 'E', label: 'ERP, billing & web apps', path: '/services/web-applications' },
  { letter: 'S', label: 'SaaS & cloud systems', path: '/services/saas' },
];

export const LEGAL_NAV: NavLink[] = [
  { label: 'Privacy policy', path: '/privacy-policy' },
  { label: 'Terms', path: '/terms' },
];

export function whatsappUrl(message = 'Hi, I would like to discuss a software project.'): string | null {
  if (!SITE.whatsappNumber) return null;
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
