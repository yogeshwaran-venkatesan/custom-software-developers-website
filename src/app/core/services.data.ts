export type Letter = 'W' | 'A' | 'M' | 'E' | 'S';

export interface ServiceDetail {
  letter: Letter;
  name: string;
  path: string;
  headline: string;
  summary: string;
  deliverables: string[];
  stack: string[];
  /** Short name on the arc card. */
  short: string;
  /** How this pillar connects with the others (shown when the card is selected). */
  connects: string;
}

/** Order on the arc, left to right. */
export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    letter: 'W', name: 'Websites & e-commerce', path: '/services/websites',
    headline: 'Websites that load fast and turn visitors into enquiries.',
    summary: 'Custom-coded company websites, SEO structure and online stores, designed from scratch for your brand.',
    deliverables: ['Custom design and build', 'SEO-ready structure', 'Online store and payments', 'Booking and WhatsApp enquiries'],
    stack: ['Angular', 'Next.js', 'Node.js', 'Razorpay'],
    short: 'Websites',
    connects: 'Your website is the front door: every enquiry, booking or order it takes flows straight into your ERP, your app and your AI agent, so nothing is re-typed.',
  },
  {
    letter: 'A', name: 'AI apps & voice agents', path: '/services/ai-solutions',
    headline: 'AI that answers the phone and clears the paperwork.',
    summary: 'Voice receptionists, payment reminder callers, assistants that answer from your own documents, and workflow automation.',
    deliverables: ['AI voice receptionist', 'Automated reminder calls', 'Document Q&A assistant', 'Workflow automation'],
    stack: ['Python', 'LLM APIs', 'Speech-to-text', 'Telephony APIs'],
    short: 'AI Agents',
    connects: 'AI agents work on top of your data: they answer calls, send due-date reminders and log every conversation back into billing and CRM.',
  },
  {
    letter: 'M', name: 'Mobile apps', path: '/services/mobile-apps',
    headline: 'Apps your customers and staff open every day.',
    summary: 'iOS and Android apps from one codebase: ordering, booking, field operations, with offline mode built in.',
    deliverables: ['iOS and Android apps', 'Offline-ready field apps', 'Ordering and booking', 'Play Store and App Store release'],
    stack: ['Flutter', 'React Native', 'Firebase', 'REST APIs'],
    short: 'Mobile Apps',
    connects: 'Mobile apps put the same system in your customers\' and field staff\'s pockets, working offline and syncing to the same database.',
  },
  {
    letter: 'E', name: 'ERP, billing & web apps', path: '/services/web-applications',
    headline: 'Software shaped around how your business already runs.',
    summary: 'Inventory and barcode billing, GST invoicing, CRM portals and multi-branch dashboards with role-based access.',
    deliverables: ['Barcode billing and GST', 'Inventory and stock', 'CRM and customer portals', 'Multi-branch dashboards'],
    stack: ['Angular', '.NET', 'Node.js', 'PostgreSQL'],
    short: 'ERP & Web Apps',
    connects: 'The ERP is the backbone: billing, stock, GST and branches in one place, feeding your website, apps, AI agents and owner dashboards.',
  },
  {
    letter: 'S', name: 'SaaS & cloud systems', path: '/services/saas',
    headline: 'Your product idea, taken from zero to paying users.',
    summary: 'Multi-tenant SaaS engineering: accounts, subscriptions, admin panels and cloud hosting that scales.',
    deliverables: ['MVP in weeks', 'Multi-tenant accounts', 'Subscriptions and billing', 'Cloud deployment'],
    stack: ['Angular', 'Node.js', 'PostgreSQL', 'AWS'],
    short: 'SaaS MVPs',
    connects: 'A SaaS MVP turns your own process into a product other businesses pay for, built on the same stack and with the source code fully yours.',
  },
];
