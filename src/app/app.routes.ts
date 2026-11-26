import { Routes } from '@angular/router';

const serviceDetail = () => import('./pages/service-detail/service-detail').then((m) => m.ServiceDetailPage);
const legal = () => import('./pages/legal/legal-page').then((m) => m.LegalPage);

/** Each route carries SEO data (title, description) read by SeoService. */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: 'Custom Software Developers | Websites, AI, Mobile Apps & ERP',
    data: { description: 'You focus on growth. We handle the code. Custom websites, AI voice and chat agents, iOS and Android apps, ERPs and SaaS, built around your workflow. You own 100% of the code.' },
  },
  {
    path: 'services', loadComponent: () => import('./pages/services/services-page').then((m) => m.ServicesPage), title: 'Services | Custom Software Developers',
    data: { kicker: 'Services', heading: 'Everything we build, and how we engage', intro: 'Websites, AI solutions, mobile apps, web applications, ERPs and SaaS, engineered to fit your business. Compare engagement models and pick what suits you.', description: 'Custom software services: websites, AI apps and voice agents, mobile apps, ERP and billing systems, and SaaS products.' },
  },
  {
    path: 'services/websites', loadComponent: serviceDetail, title: 'Custom Business Websites | Custom Software Developers',
    data: { letter: 'W',  kicker: 'Websites & e-commerce', heading: 'Websites that load fast and win customers', intro: 'Custom-coded corporate websites, SEO architecture and conversion-focused online stores.', description: 'Custom-coded business websites and e-commerce stores, fast and SEO-ready.' },
  },
  {
    path: 'services/ai-solutions', loadComponent: serviceDetail, title: 'AI Apps & Voice Agents | Custom Software Developers',
    data: { letter: 'A',  kicker: 'AI-integrated applications', heading: 'AI that answers calls and clears paperwork', intro: 'AI voice receptionists, payment reminder callers, document assistants and workflow automation, connected to your systems.', description: 'AI voice agents, reminder callers, RAG document assistants and workflow automation for businesses.' },
  },
  {
    path: 'services/mobile-apps', loadComponent: serviceDetail, title: 'iOS & Android App Development | Custom Software Developers',
    data: { letter: 'M',  kicker: 'Mobile apps', heading: 'Apps your customers and staff open every day', intro: 'Native-feel iOS and Android apps, offline-ready field apps, and ordering and booking platforms.', description: 'iOS and Android app development: customer apps, field operations apps and booking platforms.' },
  },
  {
    path: 'services/web-applications', loadComponent: serviceDetail, title: 'Custom ERP, Billing & Web Apps | Custom Software Developers',
    data: { letter: 'E',  kicker: 'Web applications, ERP & SaaS', heading: 'Software shaped around how you work', intro: 'Inventory and barcode billing, CRM portals, multi-branch dashboards, role-based web apps and multi-tenant SaaS.', description: 'Custom ERP, billing, CRM portals, dashboards and SaaS products.' },
  },
  {
    path: 'services/saas', loadComponent: serviceDetail, title: 'SaaS Product Development | Custom Software Developers',
    data: { letter: 'S', description: 'SaaS product development: MVPs, multi-tenant accounts, subscriptions, admin panels and cloud hosting.' },
  },
  {
    path: 'work', loadComponent: () => import('./pages/work/work-page').then((m) => m.WorkPage), title: 'Live Demos | Custom Software Developers',
    data: { kicker: 'Live demos', heading: 'Try what we build', description: 'Interactive demos of custom software we build: barcode billing and inventory ERP, an AI voice payment-reminder agent, and mobile and web app portals.' },
  },
  {
    path: 'products/seettu-pro', loadComponent: () => import('./pages/seettu/seettu-page').then((m) => m.SeettuPage), title: 'Seettu Pro: Savings-Scheme App for Shops | Custom Software Developers',
    data: { kicker: 'Our product', heading: 'Seettu Pro, the savings-scheme app for shops', intro: 'Members track and pay their Deepavali and festival seettu cards on their phone, in Tamil or English. The shop runs every scheme from the counter dashboard.', description: 'Seettu Pro: savings-scheme (seettu) app for shops, with a member mobile app, UPI payments, Tamil and English, and a shop counter dashboard.' },
  },
  {
    path: 'process', loadComponent: () => import('./pages/process/process-page').then((m) => m.ProcessPage), title: 'How We Work | Custom Software Developers',
    data: { kicker: 'Process', heading: 'From requirement blueprint to AMC', intro: 'Four clear steps: blueprint, design and architecture, weekly sprints, and deployment with ongoing support.', description: 'Our software development process from discovery to annual maintenance.' },
  },
  {
    path: 'about', loadComponent: () => import('./pages/about/about-page').then((m) => m.AboutPage), title: 'About | Custom Software Developers',
    data: { kicker: 'About', heading: 'Engineering you own outright', intro: 'Our philosophy, full source-code ownership, and the stack we build with.', description: 'About Custom Software Developers: engineering philosophy, code ownership and tech stack.' },
  },
  {
    path: 'contact', loadComponent: () => import('./pages/contact/contact-page').then((m) => m.ContactPage), title: 'Start a Project | Custom Software Developers',
    data: { kicker: 'Contact', heading: 'Tell us what to build', intro: 'Build your project scope and send it on WhatsApp or email. We reply with questions, a plan and an estimate.', description: 'Contact Custom Software Developers to scope your project.' },
  },
  {
    path: 'privacy-policy', loadComponent: legal, title: 'Privacy Policy | Custom Software Developers',
    data: { doc: 'privacy',  kicker: 'Legal', heading: 'Privacy policy', intro: 'How we collect, use and protect your information.', description: 'Privacy policy of Custom Software Developers.' },
  },
  {
    path: 'terms', loadComponent: legal, title: 'Terms | Custom Software Developers',
    data: { doc: 'terms',  kicker: 'Legal', heading: 'Terms of use', intro: 'The terms that apply to this website and our services.', description: 'Terms of use of Custom Software Developers.' },
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
    title: 'Page not found | Custom Software Developers',
    data: { description: 'This page could not be found.', noindex: true },
  },
];
