import { Letter } from './services.data';

export interface ServicePage {
  /** Photo in /public/img used in the page hero (jpg + webp). */
  img: string;
  imgAlt: string;
  /** Who usually asks us for this. */
  forWho: string[];
  /** What a typical engagement includes. */
  includes: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
}

/** Long-form content for each /services/* page, keyed by service letter. */
export const SERVICE_PAGES: Record<Letter, ServicePage> = {
  W: {
    img: 'studio-developer', imgAlt: 'A developer working on a website layout across two monitors',
    forWho: [
      'Businesses whose current site is slow, dated or hard to update',
      'Shops and brands ready to take orders and payments online',
      'Service companies that want more calls, bookings and WhatsApp enquiries',
    ],
    includes: [
      { title: 'Custom design', body: 'Designed from scratch around your brand and customers. No bought theme, no page builder.' },
      { title: 'Speed and SEO structure', body: 'Fast pages, clean headings, meta tags, sitemap and structured data so search engines understand you.' },
      { title: 'Online store', body: 'Product catalogue, cart, Razorpay or UPI payments, order emails and a simple admin to manage it all.' },
      { title: 'Enquiries that reach you', body: 'Contact forms, booking requests and WhatsApp buttons that land straight in your inbox or phone.' },
      { title: 'Content you can edit', body: 'Update text, photos, prices and offers yourself, without calling a developer.' },
      { title: 'Hosting and domain', body: 'We set up hosting, SSL and your domain in your own name, and hand over every login.' },
    ],
    faqs: [
      { q: 'Do you use WordPress or templates?', a: 'No. We write the site in code, designed for your business. It loads faster and has nothing extra to break.' },
      { q: 'Can I update the website myself?', a: 'Yes. We add an admin area for the content you change often, such as products, prices, photos and offers.' },
      { q: 'Who owns the website?', a: 'You do. The code, domain, hosting account and content are in your name.' },
      { q: 'How is the price decided?', a: 'After a short call we write a requirement blueprint and give a fixed quote for that scope.' },
    ],
  },
  A: {
    img: 'ai-voice-lab', imgAlt: 'Audio waveforms and an AI voice interface on screens in a studio',
    forWho: [
      'Clinics, hotels and service businesses that miss calls after hours',
      'Lenders, schools and shops that spend hours on payment reminder calls',
      'Teams that search through PDFs, manuals and policies all day',
    ],
    includes: [
      { title: 'AI voice receptionist', body: 'Answers calls, books appointments and answers common questions in English, Tamil or Malayalam.' },
      { title: 'Reminder caller', body: 'Calls customers about dues and renewals, logs the reply and flags who needs a human follow-up.' },
      { title: 'Document assistant', body: 'Answers questions from your own files and shows the source page, so staff can check the answer.' },
      { title: 'Workflow automation', body: 'Reads invoices, forms and emails and fills your existing software, so nobody types it twice.' },
      { title: 'Connected to your systems', body: 'Works with your CRM, ERP, Google Sheets or database instead of creating another island of data.' },
      { title: 'Human in control', body: 'Every call and answer is logged, with clear limits on what the AI may do on its own.' },
    ],
    faqs: [
      { q: 'Will the AI speak our local language?', a: 'We build and test for English, Tamil and Malayalam. We confirm quality on your real call scripts before launch.' },
      { q: 'Is our data shared with anyone else?', a: 'No. Your documents stay in your own storage and are used only to answer your users.' },
      { q: 'What if the AI gives a wrong answer?', a: 'Answers come from your documents with the source shown, and anything unclear is handed to a person.' },
      { q: 'Are there running costs?', a: 'Yes. AI and calling services charge by usage. We estimate this with you before building.' },
    ],
  },
  M: {
    img: 'devices-slate', imgAlt: 'A phone and a tablet showing app screens on a slate desk',
    forWho: [
      'Businesses that want customers to order, book or pay from their phone',
      'Field sales and service teams still working on paper or WhatsApp',
      'Founders with an app idea who need it built properly the first time',
    ],
    includes: [
      { title: 'iOS and Android', body: 'One codebase for both platforms, with a native look and feel.' },
      { title: 'Works offline', body: 'Field apps keep working without signal and sync when the phone is back online.' },
      { title: 'Payments and notifications', body: 'UPI and card payments, push notifications and SMS or WhatsApp alerts.' },
      { title: 'Admin panel', body: 'A web dashboard for your team to manage users, orders and content.' },
      { title: 'Store release', body: 'We publish to the Play Store and App Store under your developer accounts.' },
      { title: 'Updates after launch', body: 'Bug fixes, OS updates and new features under an annual maintenance contract.' },
    ],
    faqs: [
      { q: 'Do I need separate apps for iPhone and Android?', a: 'No. We build both from one codebase, which keeps cost and maintenance down.' },
      { q: 'Whose name is the app published under?', a: 'Yours. We publish to your Play Store and App Store accounts, and you own the code.' },
      { q: 'Can you take over an existing app?', a: 'Yes. We review the code first and tell you plainly whether to fix it or rebuild.' },
      { q: 'How long does an app take?', a: 'It depends on scope. You get a working build every week from the first sprint.' },
    ],
  },
  E: {
    img: 'office-night', imgAlt: 'A laptop with a dashboard on a desk in a quiet office at night',
    forWho: [
      'Shops and wholesalers running billing and stock on spreadsheets',
      'Multi-branch businesses that cannot see live sales and stock',
      'Companies whose off-the-shelf software forces them to change how they work',
    ],
    includes: [
      { title: 'Barcode billing and GST', body: 'Fast counter billing with barcode scanning, GST invoices and thermal or A4 printing.' },
      { title: 'Inventory and stock', body: 'Stock across branches and godowns, transfers, reorder alerts and stock-take.' },
      { title: 'CRM and customer portals', body: 'Customer records, follow-ups, quotations and a portal for customers to view orders and dues.' },
      { title: 'Roles and approvals', body: 'Each staff member sees only what they need, with approvals for discounts and edits.' },
      { title: 'Owner dashboards', body: 'Live sales, collections and stock across branches, on desktop and phone.' },
      { title: 'Data migration', body: 'We move your existing data from Excel or old software, checked before go-live.' },
    ],
    faqs: [
      { q: 'Why custom instead of ready-made software?', a: 'Custom software follows your process, has no per-user licence fees, and you own it outright.' },
      { q: 'Can it work with our Tally or existing software?', a: 'In most cases yes, through exports, imports or APIs. We confirm during the blueprint.' },
      { q: 'Will it work if the internet goes down?', a: 'We can build counter billing that keeps working offline and syncs later.' },
      { q: 'Can my staff learn it quickly?', a: 'We design around their current steps and train every team before go-live.' },
    ],
  },
  S: {
    img: 'studio-developer', imgAlt: 'A developer working across two monitors in a studio',
    forWho: [
      'Founders turning an idea into a product with paying customers',
      'Businesses that want to sell their in-house tool to others',
      'Teams that need a product rebuilt to handle more customers',
    ],
    includes: [
      { title: 'MVP first', body: 'We build the smallest product that proves the idea, then grow it with real user feedback.' },
      { title: 'Multi-tenant accounts', body: 'Each customer gets their own workspace, users and data, kept apart securely.' },
      { title: 'Subscriptions and billing', body: 'Plans, trials, invoices and recurring payments through Razorpay or Stripe.' },
      { title: 'Admin and analytics', body: 'An admin panel for your team, with sign-ups, usage and revenue at a glance.' },
      { title: 'Cloud hosting', body: 'Deployed on AWS or similar, with backups, monitoring and room to grow.' },
      { title: 'Security basics done right', body: 'Secure logins, roles, audit logs and data protection from day one.' },
    ],
    faqs: [
      { q: 'Who owns the product and the code?', a: 'You do, completely. We do not take equity or keep rights to your code.' },
      { q: 'How fast can we launch?', a: 'We plan an MVP you can show customers in weeks, with weekly working builds along the way.' },
      { q: 'Can you keep developing it after launch?', a: 'Yes, through monthly sprints or an annual maintenance contract.' },
      { q: 'Do you sign an NDA?', a: 'Yes, before we discuss your idea in detail.' },
    ],
  },
};
