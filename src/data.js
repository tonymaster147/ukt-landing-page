// All landing-page content, extracted verbatim from the approved design.

export const PHONE = '+44 7365 600193'
export const PHONE_TEL = '+447365600193'
export const EMAIL = 'info@translations.co.uk'
export const WHATSAPP_URL =
  'https://wa.me/447365600193?text=Hi%2C%20I%27d%20like%20a%20translation%20quote.'

// Every call-to-action points here.
export const QUOTE_URL = 'https://www.translations.co.uk/quote/'

// Quote form submission: our own PHP endpoint on the WordPress server.
// It stores files in /files_upload and inserts the lead into the DB table.
// Set this to wherever you upload the /api folder (see api/README.md).
export const SUBMIT_ENDPOINT =
  'https://www.translations.co.uk/translation-agency/api/submit.php'

// Where the visitor is sent after a successful submission.
export const THANK_YOU_URL = 'https://www.translations.co.uk/thank-you-two/'

export const trustStrip = [
  { k: '98%', v: 'Satisfaction rate', icon: 'uploads/icons/0501.png' },
  { k: '100%', v: 'Human translation', icon: 'uploads/icons/0402.png' },
  { k: '200+', v: 'Languages', icon: 'uploads/icons/0303.png' },
  { k: '24/7', v: 'Support', icon: 'uploads/icons/0204.png' },
  { k: 'ISO', v: 'Guaranteed quality', icon: 'uploads/icons/0105.png' },
]

export const trustLogos = [
  { src: 'uploads/Gov.webp', alt: 'GOV.UK' },
  { src: 'uploads/Hm-courts.webp', alt: 'HM Courts & Tribunals Service' },
  { src: 'uploads/NHS-1.webp', alt: 'NHS' },
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

export const proFeatures = [
  'Covers technical, legal, medical and financial content.',
  'Handled by specialists with domain-specific knowledge.',
]

export const certFeatures = [
  'Certified translations for legal, immigration and official purposes.',
  'Includes certification with a stamp and signature.',
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
    q: 'Will my certified translation be accepted by the Home Office, UKVI, and other UK authorities?',
    a: "Yes. Our certified translations are accepted by the UK Home Office, UKVI, Passport Office, DVLA, HM Courts & Tribunals, NHS, and UK ENIC. Every certified translation includes a signed statement of accuracy, the translator's credentials, and our official stamp — exactly the format UK government bodies require. We maintain a 100% acceptance rate with official institutions.",
  },
  {
    q: "What's the difference between your £15 and £25 pricing?",
    a: "Professional translation starts at £15 per page and covers business, technical, legal, and medical content where no official certification is needed. Certified translation starts at £25 per page and includes a signed certificate of accuracy with stamp and signature, required for visa applications, immigration, and official submissions. Not sure which you need? Tell us the purpose in the quote form and we'll confirm before you pay.",
  },
  {
    q: 'How fast can I get my translation?',
    a: 'Standard documents such as birth certificates, marriage certificates, and driving licences are typically delivered within 6–24 hours. Larger or specialist documents take 1–2 business days. Your exact delivery date is confirmed in your instant quote before you pay — and we deliver on or before that deadline, guaranteed.',
  },
  {
    q: 'Can you translate my birth certificate, marriage certificate, or driving licence?',
    a: 'Yes — these are our most common orders. We provide certified translations of birth certificates, marriage certificates, driving licences, academic transcripts, bank statements, and passports in 200+ language pairs, usually within 24 hours. Upload your document through the quote form to get your price instantly.',
  },
  {
    q: 'Is my translation done by a human or a machine?',
    a: 'Every certified and official translation is completed 100% by a qualified human linguist — never machine translation. However, for scalable professional translations such as ecommerce, website, and industrial translations, we assign a native-speaking translator with subject expertise, offering machine-assisted human translation. For every translation, we conduct a thorough quality check before delivery, in line with our ISO 17100-certified process.',
  },
  {
    q: 'How do I get a quote and place an order?',
    a: "Fill in the quote form above, upload your document, choose the delivery date and format, and you'll receive an instant quote. Pay securely online, and your translation is delivered as a PDF to your email as per your deadline — with hard copies available on request. The whole process takes under two minutes to start.",
  },
  {
    q: 'Are my documents kept confidential?',
    a: 'Yes. All translators are bound by strict non-disclosure agreements, and your files are handled through secure, encrypted systems. Your documents are never shared, and we comply fully with UK GDPR.',
  },
  {
    q: 'Do you provide notarised or sworn translations?',
    a: "Yes. Alongside standard certified translations, we arrange notarised translations (authenticated by a Public Notary) and sworn translations for countries that require them, such as Spain, France, and Germany. Mention the requirement in your quote request and we'll confirm the right option for your destination authority.",
  },
  {
    q: 'Which languages do you cover?',
    a: "We translate across 200+ language pairs, including Spanish, German, Ukrainian, Arabic, Hindi, Chinese, Portuguese, and Polish — for both certified and professional purposes. If your language pair isn't listed on this page, request a quote anyway; we almost certainly cover it.",
  },
]
