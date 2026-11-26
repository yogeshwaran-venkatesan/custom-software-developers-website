export interface LegalDoc {
  title: string;
  updated: string;
  intro: string;
  sections: { h: string; p: string[] }[];
}

/**
 * Plain-language legal pages. Review with a lawyer before launch and update `updated` on every change.
 * Contact email is injected from SITE at render time via the {email} token.
 */
export const LEGAL: Record<'privacy' | 'terms', LegalDoc> = {
  privacy: {
    title: 'Privacy policy',
    updated: '25 November 2026',
    intro: 'This policy explains what information Custom Software Developers collects through this website and how we use it.',
    sections: [
      { h: 'Information we collect', p: [
        'This website has no user accounts and no contact form that stores data on our servers. When you send us a project brief, it opens your own email or WhatsApp app and you choose whether to send it.',
        'If you contact us, we receive the details you choose to share, such as your name, email address, phone number and project description.',
      ] },
      { h: 'How we use it', p: [
        'We use your details only to reply to you, prepare a proposal and deliver the work you ask for. We do not sell or rent your information, and we do not send marketing messages you did not ask for.',
      ] },
      { h: 'Cookies and analytics', p: [
        'This website does not set advertising cookies. If we add privacy-friendly analytics to understand page visits, we will update this policy first.',
      ] },
      { h: 'Client project data', p: [
        'Data inside software we build for you belongs to you. We access it only to build, test, deploy and support that software, and we keep it confidential.',
      ] },
      { h: 'How long we keep it', p: [
        'We keep emails and project records for as long as needed to serve you and meet legal and accounting requirements, then delete them.',
      ] },
      { h: 'Your choices', p: [
        'You can ask us to show, correct or delete the personal information we hold about you by writing to {email}.',
      ] },
      { h: 'Changes', p: [ 'We may update this policy. The date at the top shows the latest version.' ] },
    ],
  },
  terms: {
    title: 'Terms of use',
    updated: '25 November 2026',
    intro: 'These terms apply to your use of this website. Project work is covered by a separate written agreement signed before work starts.',
    sections: [
      { h: 'Use of this website', p: [
        'You may browse this website and share links to it. Do not copy its design, code or content for commercial use without our written permission.',
      ] },
      { h: 'Information on this site', p: [
        'Descriptions of services, example projects and interactive previews are for general information. Demo screens use sample data. A quote or proposal from us is valid only when given in writing.',
      ] },
      { h: 'Project agreements', p: [
        'Scope, price, timeline, payment milestones, ownership of code and support terms for any project are set out in the written proposal or agreement for that project.',
      ] },
      { h: 'Intellectual property', p: [
        'The Custom Software Developers name, logo and website content belong to us. Seettu Pro is our product. Third-party names and trademarks belong to their owners.',
      ] },
      { h: 'Links to other sites', p: [
        'Links to other websites, such as WhatsApp or app stores, are provided for convenience. We are not responsible for their content or policies.',
      ] },
      { h: 'Liability', p: [
        'We work to keep this website accurate and available, but we cannot guarantee it is always error-free or uninterrupted. To the extent the law allows, we are not liable for losses arising from use of this website.',
      ] },
      { h: 'Governing law', p: [ 'These terms are governed by the laws of India.' ] },
      { h: 'Contact', p: [ 'Questions about these terms can be sent to {email}.' ] },
    ],
  },
};
