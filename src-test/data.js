// All landing-page content, extracted verbatim from the approved design.

export const PHONE = '+44 7454 757504'
export const PHONE_TEL = '+447454757504'
export const EMAIL = 'info@translations.co.uk'
export const WHATSAPP_URL =
  'https://wa.me/447454757504?text=Hi%2C%20I%27d%20like%20a%20translation%20quote.'

// Every call-to-action points here.
export const QUOTE_URL = 'https://www.translations.co.uk/quote/'

// LiveChat direct link — used by "Talk to an Expert" / "Talk to a Specialist".
export const LIVECHAT_URL = 'https://direct.lc.chat/3946801/18'

// Quote form submission: our own PHP endpoint on the WordPress server.
// It stores files in /files_upload and inserts the lead into the DB table.
// Set this to wherever you upload the /api folder (see api/README.md).
// NOTE: the /api folder is deployed at /translation-agency/api/ on the server.
// It is NOT present under /translation-agency-test-only/, which is why the form
// previously failed. Upload /api there too if you want test leads kept separate.
export const SUBMIT_ENDPOINT =
  'https://www.translations.co.uk/translation-agency/api/submit.php'

// Where the visitor is sent after a successful submission.
export const THANK_YOU_URL = 'https://www.translations.co.uk/thank-you-two/'

/* Registered details shown in the footer. */
export const footerInfo = {
  address: '128 City Road, London, United Kingdom, EC1V 2NX',
  companyNumber: 'Company Number – 16373383',
}

export const trustStrip = [
  { k: '98%', v: 'Satisfaction rate', icon: 'uploads/icons/0501.png' },
  { k: '100%', v: 'UK Certified Translator', icon: 'uploads/icons/0402.png' },
  { k: '200+', v: 'Languages', icon: 'uploads/icons/0303.png' },
  { k: '24/7', v: 'Support', icon: 'uploads/icons/0204.png' },
  { k: 'ISO', v: 'Guaranteed quality', icon: 'uploads/icons/0105.png' },
]

/* Institution logos shown in the "Accepted by" section.
   `label` is rendered as a text tile whenever the image file is missing,
   so dropping the real file into public/uploads/ upgrades the tile with
   no code change. */
export const trustLogos = [
  { src: 'uploads/logos/home-office.png', alt: 'UK Home Office', label: 'UK Home Office' },
  { src: 'uploads/logos/ukvi.png', alt: 'UK Visas & Immigration', label: 'UKVI' },
  { src: 'uploads/logos/hm-courts.png', alt: 'HM Courts & Tribunals Service', label: 'HM Courts & Tribunals' },
  { src: 'uploads/logos/hm-passport-office.png', alt: 'HM Passport Office', label: 'HM Passport Office' },
  { src: 'uploads/logos/uk-enic.png', alt: 'UK ENIC', label: 'UK ENIC' },
  { src: 'uploads/logos/dvla.png', alt: 'DVLA', label: 'DVLA' },
  { src: 'uploads/logos/ucas.png', alt: 'UCAS & UK Universities', label: 'UCAS & UK Universities' },
  { src: 'uploads/logos/nhs.png', alt: 'NHS', label: 'NHS' },
]

export const certifiedServices = [
  'Academic Translation',
  'Birth Certificate Translation',
  'Sworn Translation',
  'Driving License Translation',
  'NAATI Translation',
  'Marriage Certificate Translation',
  'Patent Translation',
  'Certified Bank Statement Translation',
]

export const professionalServices = [
  'Engineering Translation Services',
  'Ecommerce Translation',
  'Financial Translation Services',
  'Industrial Translation',
  'IT Translation Services',
  'Medical Translation',
  'Travel Translation Services',
  'Website Translation',
]

export const whyCards = [
  {
    icon: 'money',
    title: 'Affordability',
    desc: 'Need budget-friendly yet high-quality translation online within hours? We are your ideal choice, as we offer cost-effective prices!',
  },
  {
    icon: 'refresh',
    title: 'Rapid Turnaround',
    desc: 'Our professional team easily provides fast translations in as little as 6 hours for standard documents, maintaining translation standards.',
  },
  {
    icon: 'certificate',
    title: 'Certified Translators',
    desc: 'We have specialist language translators worldwide with certification recognised by the government, so they maintain regulatory compliance.',
  },
  {
    icon: 'chat',
    title: 'Expert Linguists',
    desc: 'Our translation agency UK only recruits expert linguists who provide clear, culturally sensitive, accurate, and precise language solutions.',
  },
  {
    icon: 'headset',
    title: '24/7 Support',
    desc: 'Our UK translation company is available 24/7 to monitor, track, and troubleshoot your translation for multilingual content.',
  },
  {
    icon: 'heart',
    title: 'Client-Centric Approach',
    desc: 'We offer client-centric specialised services. We discuss your needs and translate, localise, or transcreate your content accordingly.',
  },
]

export const aggregateRatings = [
  { score: '5/5', name: 'Google' },
  { score: '4.9/5', name: 'Trustpilot' },
  { score: '4.9/5', name: 'SmartCustomer' },
]

export const videoTestimonials = [
  { vid: 'HWKo0uijBi0', title: 'Visa Translation', who: 'Priya S. · London' },
  { vid: 'HO_XgczTK30', title: 'Legal Contract', who: 'Marcus D. · Manchester' },
  { vid: 'G0cJVM0HeFE', title: 'Certified Translation', who: 'Elena V. · Birmingham' },
]

export const reviews = [
  {
    name: 'Daniel Fischer, Berlin',
    date: 'February 4, 2026',
    text: 'We used Translations.co.uk for legal contract translation between English and German. The terminology was precise, and the turnaround time was excellent. Very reliable service.',
  },
  {
    name: 'Sara Ahmed, Dubai',
    date: 'December 5, 2025',
    text: 'Their website localisation service helped us expand into the Middle East market smoothly. The translated content felt culturally natural rather than just word-for-word translated.',
  },
  {
    name: 'Elena Petrova, Spain',
    date: 'December 5, 2025',
    text: 'I was nervous about getting my academic transcripts translated for university admission, but the process was straightforward and stress-free. Highly recommended for certified translations.',
  },
  {
    name: 'Dr Marcus Hill, French',
    date: 'November 18, 2025',
    text: 'Professional, responsive, and genuinely helpful. We needed urgent translation of medical documents, and they handled everything carefully with impressive accuracy.',
  },
  {
    name: 'Chloe Martin, Paris',
    date: 'November 18, 2025',
    text: "Translations.co.uk translated our eCommerce product catalogue into Spanish and French. The quality was far better than previous agencies we've worked with.",
  },
  {
    name: 'Richard Coleman, Leeds',
    date: 'October 13, 2025',
    text: 'Excellent customer support from start to finish. The team answered all my questions quickly and delivered certified translations exactly when promised.',
  },
]

export const brandLogos = [
  { src: 'uploads/g.png', alt: 'Shopify' },
  { src: 'uploads/a.png', alt: 'Bloomberg' },
  { src: 'uploads/b.png', alt: 'eBay' },
  { src: 'uploads/h.png', alt: 'Catawiki' },
  { src: 'uploads/c.png', alt: 'Expedia' },
  { src: 'uploads/d.png', alt: 'HomeAway' },
  { src: 'uploads/e.png', alt: 'Shiseido' },
  { src: 'uploads/f.png', alt: 'Tripadvisor' },
  { src: 'uploads/UKT-Govt.-ofc-newdesk.webp', alt: 'UK Visas' },
  { src: 'uploads/Hm-Passport-office.webp', alt: 'HM Passport Office' },
  { src: 'uploads/Home-office.webp', alt: 'Home Office' },
  { src: 'uploads/NHS-1.webp', alt: 'NHS' },
]

export const quickQuote = {
  title: 'Need Your Translation Today?',
  sub: 'Get Your Free Quote Within 10 Minutes.',
  dropTitle: 'Click to browse or drop your document here',
  dropNote: 'PDF, JPG, PNG, DOCX accepted (Max 25MB)',
  cta: 'Upload My Document',
  ctaSend: 'Send My Document',
  badges: [
    { icon: 'award', text: 'Strict Confidentiality' },
    { icon: 'headset', text: '24/7 UK Support' },
  ],
}

export const languageReach = {
  title: 'Translate Documents Into 200+ Languages',
  sub: 'Certified, human-translated coverage across every major region — accepted by UK government bodies. Also used by businesses internationally.',
  note: 'Official UKVI Accepted',
  moreLabel: 'and more',
  regions: [
    {
      icon: 'globe',
      name: 'European Languages',
      langs: [
        'Spanish',
        'French',
        'German',
        'Italian',
        'Portuguese',
        'Polish',
        'Romanian',
        'Dutch',
        'Greek',
        'Ukrainian',
        'Serbian',
        'Croatian',
        'Bosnian',
      ],
    },
    {
      icon: 'globe',
      name: 'Asian Languages',
      langs: [
        'Mandarin Chinese',
        'Japanese',
        'Korean',
        'Hindi',
        'Bengali',
        'Vietnamese',
        'Thai',
        'Urdu',
        'Punjabi',
        'Tagalog',
      ],
    },
    {
      icon: 'compass',
      name: 'Middle Eastern Languages',
      langs: ['Arabic', 'Farsi/Persian', 'Hebrew', 'Turkish', 'Kurdish', 'Pashto', 'Dari'],
    },
    {
      icon: 'globe',
      name: 'African Languages',
      langs: ['Swahili', 'Amharic', 'Yoruba', 'Somali', 'Hausa', 'Zulu', 'Tigrinya'],
    },
  ],
  cta: 'Need Another Language? Get a Quote',
}

export const translationSamples = {
  title: 'Translation Samples',
  sub: 'Inspect officially certified, UK Home Office-compliant document layouts with stamped translator credentials.',
  cards: [
    {
      kicker: 'Certified Translation',
      badge: 'Passport Office Approved',
      tone: 'green',
      footer: 'Official Seal & Credentials',
      icon: 'stamp',
      title: 'CIOL Translation',
      pair: 'English → Thai',
      url: 'https://www.translations.co.uk/wp-content/uploads/2025/08/english-to-thai-ciol-certified-after-and-before.pdf',
    },
    {
      kicker: 'Official Record',
      badge: 'Courts & Registrars',
      tone: 'blue',
      footer: 'Signed Certification Statement',
      icon: 'passport',
      title: 'ITI Translation',
      pair: 'Spanish → English',
      url: 'https://www.translations.co.uk/wp-content/uploads/2025/08/certified-translation-from-spanish-to-english-after-and-before.pdf',
    },
    {
      kicker: 'Official Document',
      badge: 'Home Office Accepted',
      tone: 'amber',
      footer: 'Certificate of Accuracy',
      icon: 'passport',
      title: 'Professional Translation',
      pair: 'Arabic → English',
      url: 'https://www.translations.co.uk/wp-content/uploads/2025/10/Arabic-to-English-2.pdf',
    },
    {
      kicker: 'Standard Translation',
      badge: 'General & Commercial',
      tone: 'indigo',
      footer: 'Self Certification Statement',
      icon: 'cap',
      title: 'Standard Translation',
      pair: 'English → Polish',
      url: 'https://www.translations.co.uk/wp-content/uploads/2025/08/english-to-polish-standard-translation-after-and-before.pdf',
    },
    {
      kicker: 'Certified Translation',
      badge: 'UKVI Accepted',
      tone: 'red',
      footer: 'Official Seal & Credentials',
      icon: 'briefcase',
      title: 'Professional Translation',
      pair: 'Portuguese → English',
      url: 'https://www.translations.co.uk/wp-content/uploads/2025/10/Portuguese-to-English-1.pdf',
    },
    {
      kicker: 'Certified Translation',
      badge: 'Official Use Approved',
      tone: 'teal',
      footer: 'Signed Certification Statement',
      icon: 'briefcase',
      title: 'ITI Translation',
      pair: 'Russian → English',
      url: 'https://www.translations.co.uk/wp-content/uploads/2025/10/Russian-to-English.pdf',
    },
  ],
}

export const trustReasons = {
  title: 'Why Applicants & Businesses Trust Us',
  sub: 'We don’t just translate words — we eliminate application risks, speed up approvals, and maximise acceptance across all official UK authorities.',
  cards: [
    {
      icon: 'personCheck',
      title: 'Qualified Native Human Translators',
      text: 'Machine and automated translations often misinterpret legal nuances, leading to costly document rejections. Our qualified, native-speaking linguists ensure 100% contextual accuracy, exact terminology matching, and flawless formatting tailored to official UK standards.',
    },
    {
      icon: 'stamp',
      title: 'Official UK Certification',
      text: 'Fully recognised by the UK Home Office, UKVI, HM Courts, universities, and government bodies, every document comes complete with an official certification statement, translator credentials, company seal, and direct contact details.',
    },
    {
      icon: 'truck',
      title: 'Same-Day & Express Turnaround',
      text: 'Never miss an urgent visa application deadline or court hearing date. Receive fully certified digital PDF copies in your inbox in as little as 24 hours (with same-day express options available), ready for immediate online submission.',
    },
    {
      icon: 'tag',
      title: 'Clear, Upfront Pricing — No Hidden Fees',
      text: 'What you see is what you pay. Standard document rates start at £15, and official certified translations start at £25, with zero unexpected per-word surcharges or hidden express fees added at checkout.',
    },
    {
      icon: 'shieldLock',
      title: 'ISO-Certified Quality & Security',
      text: 'Your sensitive legal, financial, and personal data is protected under strict bank-grade confidentiality and data protection standards. Our ISO-certified procedures guarantee rigorous multi-stage quality checks before any file reaches your hands.',
    },
    {
      icon: 'headset',
      title: 'Dedicated UK-Based Customer Care',
      text: 'Get real-time updates and quick answers whenever you need them. Our responsive UK-based support team is available around the clock via live chat and email to assist with urgent updates, custom requests, and order tracking.',
    },
  ],
  barTitle: 'Have an emergency? We are available. ',
  barNote: 'Secure Payment Options • No Hidden Fees',
  cta: 'Get Your Fast Quote Now',
}

export const acceptance = {
  title: 'Need Your Translation Accepted the First Time?',
  sub: 'A single formatting error or uncertified stamp can delay your application for weeks. We have certified translators, so you can submit with total confidence.',
  cards: [
    {
      icon: 'passport',
      title: 'Visa & Immigration Documents',
      badge: 'Widely accepted by the UKVI and the Home Office.',
      text: 'Includes signed translator credentials and the official certification stamp required by UK authorities.',
    },
    {
      icon: 'cap',
      title: 'University & UCAS Transcripts',
      badge: 'Accepted by UCAS, UK ENIC and UK universities.',
      text: 'Perfectly structured degree certificates, transcripts, and diplomas formatted to meet strict academic admissions standards.',
    },
    {
      icon: 'baby',
      title: 'Birth Certificate Translation',
      badge: 'Accepted by HM Passport Office, the General Register Office and local councils.',
      text: 'Flawless, word-for-word certified translations for passport applications, registry offices, and legal identity verification.',
    },
    {
      icon: 'rings',
      title: 'Marriage & Divorce Certificates',
      badge: 'Recognised by UK Courts, Registrars and Government Bodies.',
      text: 'Officially certified for legal name changes, spouse visa applications, and official marital status updates across the UK.',
    },
    {
      icon: 'licence',
      title: 'Driving Licence Translation',
      badge: 'Accepted by the DVLA and UK insurance providers.',
      text: 'Accurate, official translations of overseas driving licences for seamless DVLA exchanges and legal UK driving compliance.',
    },
    {
      icon: 'gavel',
      title: 'Legal & Court Documentation',
      badge: 'Court-Recognised and Fully Validated.',
      text: 'Fully compliant translations for solicitor submissions, court proceedings, probate, and binding legal agreements.',
    },
    {
      icon: 'briefcase',
      title: 'Business & Commercial Documentation',
      badge: 'Ready for Banking, Companies House and Commercial Deals.',
      text: 'High-precision translation of articles of association, financial statements, and business contracts by industry specialists.',
    },
  ],
  barTitle: 'Translate My Document Now',
  barNote: 'Delivered in 24 Hours  •  Starting at £15',
  cta: 'Get Started Right Now',
}

export const comparison = {
  title: 'Not All Translation Services Are Equal',
  kicker: 'This is how Translations.co.uk sets the standards',
  lead: 'Don’t risk document rejection — see why customers trust us for official UK submissions.',
  cols: {
    feature: 'Feature',
    us: 'Translations.co.uk',
    them: 'Typical Agencies',
    why: 'Why it matters to you',
  },
  cta: 'Get Your Guaranteed Quote Now',
  rows: [
    {
      feature: 'Home Office Approved',
      us: '97.58% Accepted',
      them: 'Not Guaranteed',
      tone: 'warn',
      why: 'Prevents rejections caused by translation formatting or certification errors.',
    },
    {
      feature: 'Human Translation',
      us: '100% Human',
      them: 'AI / Mixed',
      tone: 'warn',
      why: 'Guarantees accuracy and valid certification stamps.',
    },
    {
      feature: '24-Hour Delivery',
      us: '24 Hours',
      them: '2–5 Days',
      tone: 'bad',
      why: 'Avoids missed deadlines for urgent applications.',
    },
    {
      feature: 'Transparent Pricing',
      us: 'From £15 / £25',
      them: 'Hidden Fees',
      tone: 'bad',
      why: 'No unexpected per-word surcharges at checkout.',
    },
    {
      feature: 'ISO-Certified Quality',
      us: 'ISO Certified',
      them: 'Not Certified',
      tone: 'bad',
      why: 'Ensures strict data security and translation checks.',
    },
    {
      feature: 'UK-Based Support',
      us: 'Call / Email',
      them: 'Bot Support',
      tone: 'bad',
      why: 'Fast assistance when you need urgent updates.',
    },
  ],
}

export const specialistBand = {
  title: 'Need a custom volume discount or complex legal translation?',
  linkText: 'Talk to a Specialist',
  sub: 'or upload your document for an immediate quote. No hidden fees.',
  cta: 'Upload Document',
  badges: [
    { icon: 'cert', label: 'ISO 17100' },
    { icon: 'shield', label: 'GDPR Compliance' },
    { icon: 'human', label: 'Human Translation Only' },
    { icon: 'award', label: 'Certified Linguists' },
    { icon: 'lock', label: '100% Confidential Documents' },
  ],
}

export const pricingIntro = {
  title: 'Certified Document Translations from £25 — No Hidden Fees',
  sub: 'Choose official government-accepted translations for legal and visa use, or flexible professional translation for commercial content.',
  // Compact assurance strip under the heading.
  assurances: [
    { icon: 'shield', text: 'Guaranteed Quality' },
    { icon: 'star', text: '98% Customer Satisfaction' },
    { icon: 'cert', text: 'UK Certified Translators' },
  ],
}

export const pricingPlans = [
  {
    id: 'professional',
    name: 'Professional Translation',
    price: '£15',
    unit: 'per page*',
    blurb: 'Ideal for commercial, web, and marketing content.',
    perfectFor: [
      'Business Documents',
      'Websites & E-commerce',
      'User Manuals & Guides',
      'Marketing Collateral',
      'Technical Documentation',
    ],
    included: [
      { text: 'Translated by Industry-Expert Human Translators' },
      { text: 'Rigorous Quality Assurance & Editing' },
      { text: 'Digital Delivery (PDF / Word)' },
      { text: 'Turnaround: Varies', icon: 'bolt' },
    ],
    cta: 'Get Business Quote',
    featured: false,
  },
  {
    id: 'certified',
    name: 'Certified Translation',
    price: '£25',
    unit: 'per document*',
    badge: 'Most popular',
    blurb: 'Officially stamped and court-recognised across the UK.',
    perfectFor: [
      'Visas & Immigration (UKVI / Home Office)',
      'Birth & Marriage Certificates',
      'Passports & Identification',
      'Legal Contracts & Court Documents',
      'Driving Licences & Academic Transcripts',
    ],
    included: [
      { text: 'Official Certification Stamp & Signed Translator Declaration' },
      { text: 'Qualified & Vetted Human Translators' },
      { text: 'Digital PDF + Physical Hard Copy (Optional)' },
      { text: 'Express 24-Hour Delivery Available', icon: 'bolt' },
    ],
    cta: 'Get Quote in 60s',
    featured: true,
  },
]

export const samples = [
  {
    title: 'CIOL Certified',
    pair: 'English → Thai',
    img: 'uploads/English-to-Thai.webp',
    url: 'https://www.translations.co.uk/wp-content/uploads/2025/08/english-to-thai-ciol-certified-after-and-before.pdf',
  },
  {
    title: 'Certified Translation',
    pair: 'Spanish → English',
    img: 'uploads/spanish-to-english.webp',
    url: 'https://www.translations.co.uk/wp-content/uploads/2025/08/certified-translation-from-spanish-to-english-after-and-before.pdf',
  },
  {
    title: 'NAATI Certified',
    pair: 'Pashto → English',
    img: 'uploads/Pashto-to-English.webp',
    url: 'https://www.translations.co.uk/wp-content/uploads/2025/08/pashto-to-english-standard-translation-after-and-before.pdf',
  },
  {
    title: 'Standard Translation',
    pair: 'English → Polish',
    img: 'uploads/english-to-polish.webp',
    url: 'https://www.translations.co.uk/wp-content/uploads/2025/08/english-to-polish-standard-translation-after-and-before.pdf',
  },
]

export const languages = [
  { img: 'uploads/Spanish.png', name: 'Spanish' },
  { img: 'uploads/German.png', name: 'German' },
  { img: 'uploads/Italian.png', name: 'Italian' },
  { img: 'uploads/Portuguese.png', name: 'Portuguese' },
  { img: 'uploads/Ukrainian.png', name: 'Ukrainian' },
  { img: 'uploads/Czech.png', name: 'Czech' },
  { img: 'uploads/Danish.png', name: 'Danish' },
  { img: 'uploads/Bulgarian.png', name: 'Bulgarian' },
  { img: 'uploads/Serbo-Croatian.png', name: 'Serbo-Croatian' },
  { img: 'uploads/Hebrew.png', name: 'Hebrew' },
  { img: 'uploads/Gaelic.png', name: 'Gaelic' },
  { img: 'uploads/Latin.png', name: 'Latin' },
]

export const processSteps = [
  {
    n: '1',
    icon: 'uploads/icons/STEP01.png',
    title: 'Initiate Your Order',
    desc: 'Begin by selecting your service level Certified or Professional. Choose your source and target languages, and specify whether you need expedited service.',
  },
  {
    n: '2',
    icon: 'uploads/icons/STEP02.png',
    title: 'Upload Documents',
    desc: 'Provide your file(s) for translation and confirm the total number of pages for an accurate assessment. You can also choose our express delivery service.',
  },
  {
    n: '3',
    icon: 'uploads/icons/STEP03.png',
    title: 'Receive Your Instant Quote',
    desc: "You'll immediately see a comprehensive quote detailing the total cost and the projected delivery date for your review.",
  },
  {
    n: '4',
    icon: 'uploads/icons/STEP04.png',
    title: 'Complete Your Details & Checkout',
    desc: 'Enter your information, such as name and email, and finalise your order by providing your card details through our secure payment system.',
  },
  {
    n: '5',
    icon: 'uploads/icons/STEP05.png',
    title: 'Translation Begins',
    desc: 'Once payment is confirmed, we assign your document to a qualified, native speaking translator with the relevant subject matter expertise.',
  },
  {
    n: '6',
    icon: 'uploads/icons/STEP06.png',
    title: 'Receive Your Translation',
    desc: 'Your professionally formatted translation is delivered as a digital PDF directly to your email, on or before the guaranteed delivery deadline.',
  },
]

export const faqData = [
  {
    q: 'Will UKVI accept my translation?',
    a: "We have a high acceptance rate with UKVI, the Home Office, and other UK government bodies. Every translation includes a signed certificate of accuracy stating the translator's credentials and confirming it's a complete, accurate translation in the format these bodies require. While no translation provider can guarantee acceptance, since the final decision always rests with the receiving authority, in the rare case a translation is rejected on formatting or certification grounds, we'll revise it free of charge.",
  },
  {
    q: 'How long does translation take?',
    a: 'Standard translations typically take 72 hours depending on length, and express same-day delivery is available if you need it sooner.',
  },
  {
    q: 'How much does it cost?',
    a: "Certified document translations start from £25 per page, with no hidden fees; the price you're quoted is the price you pay. Larger projects, business documents, or specialist legal translations are quoted individually, and volume discounts are available.",
  },
  {
    q: 'Can you translate today?',
    a: "Yes. We offer express same-day service for urgent documents; upload your file, and we'll confirm turnaround before you pay.",
  },
  {
    q: 'Are my files confidential?',
    a: 'Yes. All documents are handled under strict confidentiality and GDPR compliance, encrypted during upload and storage, and only accessed by the translator assigned to your job. We never share your files with third parties.',
  },
  {
    q: 'Do you use AI?',
    a: "No. Every document is translated and certified by a qualified, professional human translator, not machine translation. AI-generated translations aren't accepted for official UK submissions, and we never use them for certified work.",
  },
  {
    q: 'Can I upload scanned documents?',
    a: "Yes. We accept scans, photos, and PDFs of your original documents; you don't need an editable file. Just make sure the text is clearly legible.",
  },
  {
    q: 'Do I need notarisation?',
    a: 'Not usually; most UK government bodies, universities, and employers only require a certified translation, which is included as standard. If your specific use case requires notarisation (for example, some international or legal submissions), we also offer that as an add-on; just let us know when you order.',
  },
]

/* ------------------------------------------------------------------ */
/*  Client reviews carousel (below pricing)                            */
/* ------------------------------------------------------------------ */

/* `lead` is what shows collapsed; `rest` is revealed by "Read more".
   The split points are the ones supplied with the design. */
export const clientReviews = {
  title: 'Your Satisfaction, Our Success: Client Reviews You Can Trust',
  readMore: 'Read more',
  readLess: 'Read less',
  usefulLabel: 'Useful',
  reportLabel: 'Report',
  items: [
    {
      initials: 'AL',
      name: 'Amanda Lewis, Manchester',
      date: 'February 2, 2026',
      lead: '“Needed certified translations for visa documents on a tight deadline,',
      rest: 'and the team delivered much faster than expected. Everything was accepted without any issues. Communication was professional throughout.”',
    },
    {
      initials: 'DF',
      name: 'Daniel Fischer, Berlin',
      date: 'February 4, 2026',
      lead: '“We used Translations.co.uk for legal contract translation between',
      rest: 'English and German. The terminology was precise, and the turnaround time was excellent. Very reliable service.”',
    },
    {
      initials: 'SA',
      name: 'Sara Ahmed, Dubai',
      date: 'Dec 5, 2025',
      lead: '“Their website localisation service helped us expand into the Middle',
      rest: 'East market smoothly. The translated content felt culturally natural rather than just word-for-word translated.”',
    },
    {
      initials: 'EP',
      name: 'Elena Petrova, Spain',
      date: 'Dec 5, 2025',
      lead: '“I was nervous about getting my academic transcripts translated',
      rest: 'for university admission, but the process was straightforward and stress-free. Highly recommended for certified translations.”',
    },
    {
      initials: 'MH',
      name: 'Dr Marcus Hill, French',
      date: 'Nov 18, 2025',
      lead: '“Professional, responsive, and genuinely helpful. We needed',
      rest: 'urgent translation of medical documents, and they handled everything carefully with impressive accuracy.”',
    },
    {
      initials: 'CM',
      name: 'Chloe Martin, Paris',
      date: 'Nov 18, 2025',
      lead: '“Translations.co.uk translated our eCommerce product catalogue',
      rest: 'into Spanish and French. The quality was far better than previous agencies we’ve worked with.”',
    },
    {
      initials: 'RC',
      name: 'Richard Coleman, Leeds',
      date: 'Oct 13, 2025',
      lead: '“Excellent customer support from start to finish. The team',
      rest: 'answered all my questions quickly and delivered certified translations exactly when promised.”',
    },
    {
      initials: 'NC',
      name: 'Naomi Chen, Singapore',
      date: 'Oct 25, 2025',
      lead: '“We required multilingual business translations for an international',
      rest: 'client presentation. The translations were polished, professional, and ready ahead of schedule.”',
    },
  ],
}
