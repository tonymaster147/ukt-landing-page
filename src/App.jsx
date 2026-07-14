import { useState, useEffect, useId } from 'react'
import * as data from './data.js'
import {
  PHONE,
  PHONE_TEL,
  EMAIL,
  QUOTE_URL,
  SUBMIT_ENDPOINT,
  THANK_YOU_URL,
  WHATSAPP_URL,
} from './data.js'

const MAX = 1200

/* ------------------------------------------------------------------ */
/*  Image with a loading placeholder                                   */
/*  Shows a soft striped placeholder until the image has painted.      */
/* ------------------------------------------------------------------ */

const PLACEHOLDER =
  'repeating-linear-gradient(45deg,#F3E9E7 0,#F3E9E7 8px,#F8F1EF 8px,#F8F1EF 16px)'

function Img({ src, alt = '', style, ...rest }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      {...rest}
      style={{
        ...style,
        backgroundImage: loaded ? undefined : PLACEHOLDER,
        transition: 'opacity 0.35s ease',
        opacity: loaded ? (style && style.opacity != null ? style.opacity : 1) : 0,
      }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Inline brand icons for the "Why choose us" cards                   */
/*  (No matching icon files were supplied, so these are drawn in SVG   */
/*   to match the red line-icon look in the brief.)                    */
/* ------------------------------------------------------------------ */

function WhyIcon({ name, size = 24 }) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  switch (name) {
    case 'money':
      return (
        <svg {...p}>
          <path d="M8.5 3h7l-1.4 3.2h-4.2z" />
          <path d="M14 6.2c3 1.4 5 4.2 5 7.8a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5c0-3.6 2-6.4 5-7.8" />
          <path d="M12 10v6M10.4 11.6h3.2M10.4 13.8h3.2" />
        </svg>
      )
    case 'refresh':
      return (
        <svg {...p}>
          <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8" />
          <path d="M20 3.5V8h-4.5" />
          <path d="M20 12a8 8 0 0 1-13.7 5.7L4 16" />
          <path d="M4 20.5V16h4.5" />
        </svg>
      )
    case 'certificate':
      return (
        <svg {...p}>
          <rect x="4" y="3" width="16" height="13" rx="2" />
          <path d="M7 7h10M7 10h6" />
          <circle cx="12" cy="16.5" r="2.6" />
          <path d="M10 18.6 9 22l3-1.5 3 1.5-1-3.4" />
        </svg>
      )
    case 'chat':
      return (
        <svg {...p}>
          <path d="M4 5h16v11H8l-4 4z" />
          <path d="M8 9h8M8 12h5" />
        </svg>
      )
    case 'headset':
      return (
        <svg {...p}>
          <path d="M5 13v-1a7 7 0 0 1 14 0v1" />
          <rect x="3.2" y="12.5" width="3.6" height="6" rx="1.6" />
          <rect x="17.2" y="12.5" width="3.6" height="6" rx="1.6" />
          <path d="M19 18.5a4 4 0 0 1-4 3h-1.6" />
        </svg>
      )
    case 'heart':
      return (
        <svg {...p}>
          <path d="M12 20.3 4.6 13a4.4 4.4 0 0 1 0-6.2 4.4 4.4 0 0 1 6.2 0l1.2 1.2 1.2-1.2a4.4 4.4 0 0 1 6.2 0 4.4 4.4 0 0 1 0 6.2z" />
        </svg>
      )
    default:
      return null
  }
}

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

function useNarrow(bp = 820) {
  const [narrow, setNarrow] = useState(
    typeof window !== 'undefined' ? window.innerWidth < bp : false,
  )
  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < bp)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [bp])
  return narrow
}

/* Inline Union Jack — renders identically on every OS/browser (unlike the 🇬🇧 emoji). */
function UKFlag({ w = 18 }) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, '')
  const cs = `uk${raw}s`
  const ct = `uk${raw}t`
  return (
    <svg
      viewBox="0 0 60 30"
      width={w}
      height={w * 0.6}
      style={{ display: 'inline-block', verticalAlign: 'middle', borderRadius: 2, flexShrink: 0 }}
      role="img"
      aria-label="United Kingdom"
    >
      <clipPath id={cs}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id={ct}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath={`url(#${cs})`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${ct})`} stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  )
}

/* Clean inline icons — the ✆ / ✉ glyphs render inconsistently across fonts/OSes. */
const PhoneIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const MailIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    aria-hidden="true"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 6-10 7L2 6" />
  </svg>
)

const Stars = ({ size = 15, spacing = 2 }) => (
  <span style={{ color: '#F5A623', fontSize: size, letterSpacing: spacing }}>★★★★★</span>
)

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

function Header() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #F0E4E1',
      }}
    >
      <div
        className="section-pad"
        style={{
          maxWidth: MAX,
          margin: '0 auto',
          padding: '14px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <a
          href="https://www.translations.co.uk/"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Img
            src="uploads/logo.webp"
            alt="translations.co.uk"
            className="header-logo"
            style={{ height: 56, width: 'auto', display: 'block' }}
          />
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <a
            href={`tel:${PHONE_TEL}`}
            className="header-phone"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#1C1C1C',
              fontWeight: 800,
              fontSize: 16,
            }}
          >
            <PhoneIcon size={17} color="#E8382B" />
            {PHONE}
          </a>
          <a
            href={QUOTE_URL}
            className="btn-primary header-cta"
            style={{
              display: 'inline-block',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              color: '#fff',
              fontWeight: 800,
              fontSize: 15,
              padding: '12px 22px',
              border: 'none',
              borderRadius: 999,
              cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(232,56,43,0.25)',
            }}
          >
            <span className="cta-full">Get My Free Quote</span>
            <span className="cta-short">Free Quote</span>
          </a>
        </div>
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/*  Quote form (2-step wizard)                                         */
/* ------------------------------------------------------------------ */

// Random single-digit operand (1-9) for the math captcha.
const randDigit = () => Math.floor(Math.random() * 9) + 1

function QuoteForm() {
  const [step, setStep] = useState(1)
  const [step1Data, setStep1Data] = useState({})
  const [captchaError, setCaptchaError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  // Fresh challenge generated on load; regenerated on a wrong answer.
  const [cap, setCap] = useState(() => ({ a: randDigit(), b: randDigit() }))
  const newCaptcha = () => setCap({ a: randDigit(), b: randDigit() })

  // Capture the step-1 field values before they unmount, after validating them.
  const goToStep2 = () => {
    const form = document.querySelector('#quote-form form')
    if (form && !form.reportValidity()) return
    const el = form.elements
    setStep1Data({
      name: el['name'].value.trim(),
      email: el['email'].value.trim(),
      phone: el['phone'].value.trim(),
      from: el['from'].value.trim(),
      to: el['to'].value.trim(),
      purpose: el['purpose'].value.trim(),
    })
    setSubmitError('')
    setStep(2)
  }
  const goToStep1 = () => {
    setStep(1)
    setCaptchaError(false)
    setSubmitError('')
  }

  const onFormSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    const el = e.target.elements

    // Captcha gate — must match the current random challenge.
    const answer = parseInt((el['captcha'] && el['captcha'].value) || '', 10)
    if (answer !== cap.a + cap.b) {
      setCaptchaError(true)
      newCaptcha() // fresh sum so it can't be brute-forced
      if (el['captcha']) el['captcha'].value = ''
      return
    }
    setCaptchaError(false)

    // Build the submission (step-1 values from state + step-2 fields from the DOM)
    const fd = new FormData()
    fd.append('name', step1Data.name || '')
    fd.append('email', step1Data.email || '')
    fd.append('phone', step1Data.phone || '')
    fd.append('from', step1Data.from || '')
    fd.append('to', step1Data.to || '')
    fd.append('purpose', step1Data.purpose || '')
    fd.append('description', (el['description'] && el['description'].value.trim()) || '')
    fd.append('captcha', (el['captcha'] && el['captcha'].value) || '')
    fd.append('captcha_a', String(cap.a))
    fd.append('captcha_b', String(cap.b))

    // Attach up to 10 uploaded files (the PHP endpoint stores them in /files_upload).
    const fileInput = el['files']
    const files = fileInput && fileInput.files ? Array.from(fileInput.files).slice(0, 10) : []
    files.forEach((file) => fd.append('files[]', file, file.name))

    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch(SUBMIT_ENDPOINT, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success) {
        window.location.href = THANK_YOU_URL
      } else {
        setSubmitError(data.message || 'Something went wrong. Please try again.')
        setSubmitting(false)
      }
    } catch (err) {
      setSubmitError('Network error — please check your connection and try again.')
      setSubmitting(false)
    }
  }

  const field = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #E6D9D6',
    borderRadius: 12,
    fontSize: 15,
    background: '#FCFAFA',
    outline: 'none',
  }

  return (
    <div
      id="quote-form"
      className="quote-form"
      style={{
        background: '#fff',
        borderRadius: 24,
        padding: 34,
        boxShadow: '0 24px 60px rgba(138,32,24,0.12)',
        border: '1px solid #F3E4E1',
      }}
    >
      <div>
        <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 14px', textAlign: 'center' }}>
          Request a Free Quote
        </h2>

          {/* stepper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: '#E8382B',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#1C1C1C' }}>Your details</span>
            </div>
            <div
              style={{
                height: 2,
                flex: 1,
                background: step === 2 ? '#E8382B' : '#F0E0DD',
                borderRadius: 2,
              }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flex: 1,
                justifyContent: 'flex-end',
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: step === 2 ? '#E8382B' : '#F0E0DD',
                  color: step === 2 ? '#fff' : '#B79A95',
                  fontWeight: 900,
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <span
                style={{ fontSize: 13, fontWeight: 800, color: step === 2 ? '#1C1C1C' : '#B79A95' }}
              >
                Documents
              </span>
            </div>
          </div>

          <form onSubmit={onFormSubmit}>
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input name="name" placeholder="Name" required className="field" style={field} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email*"
                    required
                    className="field"
                    style={field}
                  />
                  <div
                    className="field-wrap"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #E6D9D6',
                      borderRadius: 12,
                      background: '#FCFAFA',
                      overflow: 'hidden',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '0 10px 0 14px',
                        fontSize: 15,
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        borderRight: '1px solid #EADBD8',
                      }}
                    >
                      <UKFlag w={18} /> +44
                    </span>
                    <input
                      name="phone"
                      placeholder="Phone"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        padding: '14px 12px',
                        fontSize: 15,
                        width: '100%',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <input name="from" placeholder="From Language" className="field" style={field} />
                  <input name="to" placeholder="To Language" className="field" style={field} />
                </div>
                <input
                  name="purpose"
                  placeholder="Purpose Of The Translation"
                  className="field"
                  style={field}
                />
                <button
                  type="button"
                  onClick={goToStep2}
                  className="btn-primary"
                  style={{
                    alignSelf: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 16,
                    padding: '14px 44px',
                    border: 'none',
                    borderRadius: 12,
                    cursor: 'pointer',
                    marginTop: 4,
                    boxShadow: '0 8px 20px rgba(232,56,43,0.25)',
                  }}
                >
                  Next →
                </button>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <textarea
                  name="description"
                  placeholder="Description"
                  rows={3}
                  className="field"
                  style={{ ...field, resize: 'vertical', fontFamily: 'inherit' }}
                />
                <label
                  className="upload-box"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '26px 16px',
                    border: '1.5px dashed #D8C7C3',
                    borderRadius: 12,
                    background: '#FCFAFA',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: 26, color: '#B0857E' }}>🗂</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#3A3634' }}>
                    Click or drag files to this area to upload.
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#A79F9A' }}>
                    You can upload up to 10 files.
                  </span>
                  <input name="files" type="file" multiple style={{ display: 'none' }} />
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#1C1C1C' }}>
                    {cap.a} + {cap.b} =
                  </span>
                  <input
                    name="captcha"
                    inputMode="numeric"
                    className="field"
                    style={{
                      width: 70,
                      padding: 12,
                      border: '1px solid #E6D9D6',
                      borderRadius: 10,
                      fontSize: 15,
                      background: '#FCFAFA',
                      outline: 'none',
                      textAlign: 'center',
                    }}
                  />
                  {captchaError && (
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#E8382B' }}>
                      Please check the answer
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 2 }}>
                  <button
                    type="button"
                    onClick={goToStep1}
                    disabled={submitting}
                    className="btn-soft"
                    style={{
                      color: '#8A2018',
                      fontWeight: 800,
                      fontSize: 15,
                      padding: '14px 24px',
                      border: 'none',
                      borderRadius: 12,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                    style={{
                      flex: 1,
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: 16,
                      padding: 15,
                      border: 'none',
                      borderRadius: 12,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      opacity: submitting ? 0.75 : 1,
                      boxShadow: '0 8px 20px rgba(232,56,43,0.25)',
                    }}
                  >
                    {submitting ? 'Sending…' : 'Submit'}
                  </button>
                </div>
                {submitError && (
                  <p
                    style={{
                      margin: 0,
                      textAlign: 'center',
                      color: '#E8382B',
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {submitError}
                  </p>
                )}
              </div>
            )}

            <p
              style={{
                textAlign: 'center',
                color: '#A79F9A',
                fontSize: 12,
                fontWeight: 600,
                margin: '16px 0 0',
              }}
            >
              🔒 Your details are secure and never shared.
            </p>
          </form>
        </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  1. Hero                                                            */
/* ------------------------------------------------------------------ */

function Hero() {
  const ratingBadge = (img, alt, score, name) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Img
        src={img}
        alt={alt}
        style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stars />
        <div style={{ fontWeight: 800, fontSize: 13 }}>
          {score} <span style={{ color: '#8A857F', fontWeight: 600 }}>{name}</span>
        </div>
      </div>
    </div>
  )

  return (
    <section
      className="hero-sec"
      style={{
        background: 'linear-gradient(180deg,#FDF1EF 0%,#FBF8F7 100%)',
        padding: '72px 0 84px',
      }}
    >
      <div
        className="section-pad grid-hero"
        style={{
          maxWidth: MAX,
          margin: '0 auto',
          padding: '0 32px',
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          gap: 56,
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#fff',
              border: '1px solid #F0DAD6',
              borderRadius: 999,
              padding: '7px 14px',
              fontWeight: 700,
              fontSize: 13,
              color: '#8A2018',
              marginBottom: 22,
            }}
          >
            <UKFlag w={18} />
            <span>UK Translation Agency · Certified &amp; Professional</span>
          </div>
          <h1
            className="h1-hero"
            style={{
              fontSize: 48,
              lineHeight: 1.08,
              fontWeight: 700,
              letterSpacing: '-1.2px',
              margin: '0 0 20px',
            }}
          >
            Certified &amp; Professional{' '}
            <span style={{ color: '#E8382B' }}>Translation Services</span> | UK Translation Agency
          </h1>
          <p
            style={{
              fontSize: 19,
              lineHeight: 1.55,
              color: '#55504E',
              maxWidth: 520,
              margin: '0 0 28px',
            }}
          >
            With a 100% approval rate, we've offered authority-compliant, professional translation
            from just £15 across 200+ language pairs for years. Reach us now at{' '}
            <a
              href={`tel:${PHONE_TEL}`}
              style={{ color: '#E8382B', fontWeight: 700, textDecoration: 'none' }}
            >
              {PHONE}
            </a>
            .
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
              marginBottom: 30,
            }}
          >
            <a
              href={QUOTE_URL}
              className="btn-primary"
              style={{
                display: 'inline-block',
                textDecoration: 'none',
                color: '#fff',
                fontWeight: 800,
                fontSize: 18,
                padding: '17px 34px',
                border: 'none',
                borderRadius: 999,
                cursor: 'pointer',
                boxShadow: '0 10px 24px rgba(232,56,43,0.28)',
              }}
            >
              Get My Free Quote
            </a>
            <a href={`tel:${PHONE_TEL}`} style={{ fontWeight: 800, fontSize: 16, color: '#1C1C1C' }}>
              or call {PHONE}
            </a>
          </div>
          <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap' }}>
            {ratingBadge('uploads/G.webp', 'Google', '5/5', 'Google')}
            {ratingBadge('uploads/T.webp', 'Trustpilot', '4.9/5', 'Trustpilot')}
            {ratingBadge('uploads/S.webp', 'SmartCustomer', '4.9/5', 'SmartCustomer')}
          </div>
        </div>

        <QuoteForm />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  2. Trust strip                                                     */
/* ------------------------------------------------------------------ */

function TrustStrip() {
  return (
    <section className="strip-sec" style={{ background: '#FBF8F7', padding: '0 0 8px' }}>
      <div
        className="section-pad"
        style={{ maxWidth: MAX, margin: '0 auto', padding: '0 32px', transform: 'translateY(-38px)' }}
      >
        <div
          className="trust-strip"
          style={{
            background: '#fff',
            border: '1px solid #F1E4E1',
            borderRadius: 22,
            boxShadow: '0 22px 50px rgba(138,32,24,0.1)',
            display: 'grid',
            gridTemplateColumns: 'repeat(5,1fr)',
            padding: 8,
          }}
        >
          {data.trustStrip.map((t, i) => (
            <div
              key={t.v}
              style={{
                padding: '24px 18px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 12,
                borderRight: i < data.trustStrip.length - 1 ? '1px solid #F4E9E6' : 'none',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 17,
                  background: '#FDECEA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Img
                  src={t.icon}
                  alt={t.v}
                  style={{ width: 42, height: 42, objectFit: 'contain' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 900,
                    letterSpacing: '-1px',
                    color: '#1C1C1C',
                    lineHeight: 1,
                  }}
                >
                  {t.k}
                </div>
                <div
                  style={{ fontSize: 13, fontWeight: 700, color: '#8A857F', letterSpacing: '0.2px' }}
                >
                  {t.v}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Reusable primary CTA button                                        */
/* ------------------------------------------------------------------ */

const CTA = ({ children, style }) => (
  <a
    href={QUOTE_URL}
    className="btn-primary cta-btn"
    style={{
      display: 'inline-block',
      textAlign: 'center',
      textDecoration: 'none',
      color: '#fff',
      fontWeight: 800,
      fontSize: 17,
      padding: '16px 32px',
      border: 'none',
      borderRadius: 999,
      cursor: 'pointer',
      boxShadow: '0 10px 24px rgba(232,56,43,0.24)',
      ...style,
    }}
  >
    {children}
  </a>
)

const heading = {
  fontSize: 32,
  fontWeight: 700,
  letterSpacing: '-0.6px',
  margin: '0 0 12px',
}

/* ------------------------------------------------------------------ */
/*  3. Official trust logos                                            */
/* ------------------------------------------------------------------ */

function OfficialTrust() {
  return (
    <section style={{ padding: '70px 0', background: '#fff' }}>
      <div
        className="section-pad"
        style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}
      >
        <p
          style={{
            fontWeight: 800,
            color: '#8A857F',
            fontSize: 14,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            margin: '0 0 8px',
          }}
        >
          Accepted &amp; trusted by official UK institutions
        </p>
        <h2 style={{ ...heading, marginBottom: 40 }}>
          Government-standard Certified Translation
        </h2>
        <div
          className="grid-3"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 24,
            marginBottom: 38,
          }}
        >
          {data.trustLogos.map((lg) => (
            <div
              key={lg.alt}
              style={{
                height: 132,
                borderRadius: 16,
                border: '1px solid #EFE2DF',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px 32px',
              }}
            >
              <Img
                src={lg.src}
                alt={lg.alt}
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>
        <CTA>Get a Government-Standard Certified Quote</CTA>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  4. Intro                                                           */
/* ------------------------------------------------------------------ */

function Intro() {
  return (
    <section style={{ padding: '20px 0 60px', background: '#fff' }}>
      <div
        className="section-pad"
        style={{ maxWidth: 820, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}
      >
        <p style={{ fontSize: 21, lineHeight: 1.6, color: '#55504E', fontWeight: 600, margin: 0 }}>
          For over a decade, businesses, individuals and government bodies across the UK have relied
          on us for accurate, authority compliant translation. Every project is handled by qualified
          human linguists, not just machines, and quality checked before delivery.
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  5. Solutions                                                       */
/* ------------------------------------------------------------------ */

function ServiceCard({ dotColor, title, items, checkBg, checkColor }) {
  return (
    <div
      className="card-pad"
      style={{
        background: '#fff',
        borderRadius: 22,
        padding: 34,
        border: '1px solid #F1E1DE',
        boxShadow: '0 12px 30px rgba(138,32,24,0.05)',
      }}
    >
      <h3
        style={{
          fontSize: 22,
          fontWeight: 700,
          margin: '0 0 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span
          style={{ width: 10, height: 10, borderRadius: 3, background: dotColor, display: 'inline-block' }}
        />
        {title}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {items.map((s) => (
          <div
            key={s}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              fontSize: 15,
              fontWeight: 600,
              color: '#3A3634',
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: checkBg,
                color: checkColor,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              ✓
            </span>
            {s}
          </div>
        ))}
      </div>
    </div>
  )
}

function Solutions() {
  return (
    <section style={{ padding: '88px 0', background: '#FBF3F1' }}>
      <div className="section-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ ...heading, margin: 0 }}>Our Translation Solutions in the United Kingdom</h2>
        </div>
        <div
          className="grid-2"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 28,
            marginBottom: 44,
          }}
        >
          <ServiceCard
            dotColor="#E8382B"
            title="Certified Translation Services"
            items={data.certifiedServices}
            checkBg="#FDECEA"
            checkColor="#E8382B"
          />
          <ServiceCard
            dotColor="#1C1C1C"
            title="Professional Translation Services"
            items={data.professionalServices}
            checkBg="#F0F0F0"
            checkColor="#1C1C1C"
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <CTA>Find My Service — Get a Quote</CTA>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  6. Why choose us                                                   */
/* ------------------------------------------------------------------ */

function WhyChoose() {
  return (
    <section style={{ padding: '88px 0', background: '#fff' }}>
      <div className="section-pad" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={heading}>Why Choose Our Professional Translation Service?</h2>
          <p
            style={{
              fontSize: 18,
              color: '#55504E',
              fontWeight: 600,
              margin: 0,
              maxWidth: 680,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            From individuals and businesses to government agencies and non profits, our UK
            translation service is the provider of choice for these reasons.
          </p>
        </div>
        <div
          className="grid-3"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 24,
            marginBottom: 44,
          }}
        >
          {data.whyCards.map((c) => (
            <div
              key={c.title}
              className="hover-card"
              style={{
                background: '#FBF8F7',
                borderRadius: 20,
                padding: 30,
                border: '1px solid #F1E8E6',
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 13,
                  background: '#FDECEA',
                  color: '#E8382B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <WhyIcon name={c.icon} size={24} />
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 8px' }}>{c.title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: '#6B655F', fontWeight: 600, margin: 0 }}>
                {c.desc}
              </p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <CTA>Get My Free Quote</CTA>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  7. Social proof                                                    */
/* ------------------------------------------------------------------ */

function SocialProof() {
  const [tab, setTab] = useState('watch')
  const [playing, setPlaying] = useState({})
  const [reviewIndex, setReviewIndex] = useState(0)

  const tabStyle = (active) => ({
    border: 'none',
    borderRadius: 999,
    padding: '11px 22px',
    fontWeight: 800,
    fontSize: 15,
    cursor: 'pointer',
    background: active ? '#E8382B' : 'transparent',
    color: active ? '#fff' : '#B7B1AC',
  })

  const cur = data.reviews[reviewIndex]

  return (
    <section style={{ padding: '88px 0', background: '#1C1C1C', color: '#fff' }}>
      <div className="section-pad" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 34 }}>
          <h2 style={{ ...heading, color: '#fff', marginBottom: 26 }}>
            Client Testimonials: Translations You Can Trust
          </h2>
          <div
            style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '14px 34px',
              marginBottom: 30,
            }}
          >
            {data.aggregateRatings.map((r) => (
              <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Stars size={17} spacing={1} />
                <span style={{ fontWeight: 800, fontSize: 15 }}>
                  {r.score} <span style={{ color: '#9C9691', fontWeight: 600 }}>{r.name}</span>
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'inline-flex',
              background: '#2A2A2A',
              borderRadius: 999,
              padding: 5,
              gap: 4,
            }}
          >
            <button onClick={() => setTab('watch')} style={tabStyle(tab === 'watch')}>
              ▶ Watch Reviews
            </button>
            <button onClick={() => setTab('read')} style={tabStyle(tab === 'read')}>
              ✍ Read Reviews
            </button>
          </div>
        </div>

        {tab === 'watch' && (
          <div
            className="grid-3"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap: 24,
              marginBottom: 40,
            }}
          >
            {data.videoTestimonials.map((v) => {
              const isPlaying = !!playing[v.vid]
              return (
                <div
                  key={v.vid}
                  style={{
                    borderRadius: 18,
                    overflow: 'hidden',
                    background: '#111',
                    border: '1px solid #333',
                  }}
                >
                  <div style={{ position: 'relative', aspectRatio: '16 / 10', background: '#000' }}>
                    {isPlaying ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${v.vid}?autoplay=1&rel=0`}
                        title={v.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                      />
                    ) : (
                      <button
                        onClick={() => setPlaying((p) => ({ ...p, [v.vid]: true }))}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          background: '#000',
                        }}
                      >
                        <Img
                          src={`https://i.ytimg.com/vi/${v.vid}/hqdefault.jpg`}
                          alt={v.title}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.82,
                          }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%,-50%)',
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: 'rgba(232,56,43,0.95)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: 22,
                            boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                          }}
                        >
                          ▶
                        </span>
                      </button>
                    )}
                  </div>
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ color: '#F5A623', fontSize: 14, letterSpacing: 1, marginBottom: 4 }}>
                      ★★★★★
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>{v.title}</div>
                    <div style={{ fontSize: 13, color: '#9C9691', fontWeight: 600 }}>{v.who}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'read' && (
          <div style={{ maxWidth: 720, margin: '0 auto 40px' }}>
            <div
              style={{
                background: '#2A2A2A',
                borderRadius: 20,
                padding: '38px 40px',
                textAlign: 'center',
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={{ color: '#F5A623', fontSize: 20, letterSpacing: 2, marginBottom: 16 }}>
                ★★★★★
              </div>
              <p
                style={{
                  fontSize: 20,
                  lineHeight: 1.6,
                  fontWeight: 600,
                  color: '#F2EFED',
                  margin: '0 0 18px',
                }}
              >
                “{cur.text}”
              </p>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>{cur.name}</div>
              <div style={{ fontSize: 13, color: '#9C9691', fontWeight: 600 }}>
                Verified · Google Reviews{cur.date ? ` · ${cur.date}` : ''}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                marginTop: 20,
              }}
            >
              <button
                onClick={() =>
                  setReviewIndex((i) => (i - 1 + data.reviews.length) % data.reviews.length)
                }
                className="nav-round"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  border: '1px solid #444',
                  background: '#2A2A2A',
                  color: '#fff',
                  fontSize: 18,
                  cursor: 'pointer',
                }}
              >
                ‹
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                {data.reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setReviewIndex(i)}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      background: i === reviewIndex ? '#E8382B' : '#555',
                    }}
                  />
                ))}
              </div>
              <button
                onClick={() => setReviewIndex((i) => (i + 1) % data.reviews.length)}
                className="nav-round"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  border: '1px solid #444',
                  background: '#2A2A2A',
                  color: '#fff',
                  fontSize: 18,
                  cursor: 'pointer',
                }}
              >
                ›
              </button>
            </div>
          </div>
        )}

        <div style={{ borderTop: '1px solid #333', paddingTop: 32 }}>
          <p
            style={{
              textAlign: 'center',
              color: '#7C766F',
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              margin: '0 0 20px',
            }}
          >
            Trusted by leading brands
          </p>
          <div
            className="brand-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 14,
              marginBottom: 40,
            }}
          >
            {data.brandLogos.map((b) => (
              <div
                key={b.alt}
                className="brand-logo"
                style={{
                  height: 66,
                  width: '100%',
                  background: '#fff',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '14px 20px',
                }}
              >
                <Img
                  src={b.src}
                  alt={b.alt}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <CTA style={{ boxShadow: '0 10px 24px rgba(232,56,43,0.3)' }}>
              Join Thousands of Satisfied Clients — Get My Quote
            </CTA>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  8. Pricing                                                         */
/* ------------------------------------------------------------------ */

function Pricing() {
  return (
    <section style={{ padding: '88px 0', background: '#fff' }}>
      <div className="section-pad" style={{ maxWidth: 960, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={heading}>Quality translation in Your Budget</h2>
          <p style={{ fontSize: 18, color: '#55504E', fontWeight: 600, margin: 0 }}>
            To hire professional translator services, call us at{' '}
            <a href={`tel:${PHONE_TEL}`} style={{ color: '#E8382B', fontWeight: 700 }}>
              {PHONE}
            </a>
            , contact our LiveChat support, or email us at{' '}
            <a href={`mailto:${EMAIL}`} style={{ color: '#E8382B', fontWeight: 700 }}>
              {EMAIL}
            </a>
            .
          </p>
        </div>
        <div
          className="grid-2"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26 }}
        >
          {/* Professional */}
          <div
            className="card-pad"
            style={{
              background: '#FBF8F7',
              borderRadius: 22,
              padding: 36,
              border: '1px solid #EEE4E1',
            }}
          >
            <div
              style={{
                fontWeight: 800,
                color: '#8A857F',
                fontSize: 14,
                letterSpacing: 1,
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              Professional
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#A79F9A', marginBottom: 2 }}>
              Starting rate
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 18 }}>
              <span style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-1.5px' }}>£15</span>
              <span style={{ color: '#8A857F', fontWeight: 700 }}>/ page</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 26 }}>
              {data.proFeatures.map((f) => (
                <div
                  key={f}
                  style={{ display: 'flex', gap: 9, fontSize: 15, fontWeight: 600, color: '#3A3634' }}
                >
                  <span style={{ color: '#E8382B', fontWeight: 900 }}>✓</span>
                  {f}
                </div>
              ))}
            </div>
            <a
              href={QUOTE_URL}
              className="btn-dark"
              style={{
                display: 'block',
                textAlign: 'center',
                textDecoration: 'none',
                width: '100%',
                color: '#fff',
                fontWeight: 800,
                fontSize: 16,
                padding: 15,
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
              }}
            >
              Get Professional Quote
            </a>
          </div>

          {/* Certified */}
          <div
            className="card-pad"
            style={{
              background: '#E8382B',
              borderRadius: 22,
              padding: 36,
              border: '1px solid #E8382B',
              color: '#fff',
              position: 'relative',
              boxShadow: '0 20px 44px rgba(232,56,43,0.28)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 20,
                right: 24,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 999,
                padding: '5px 12px',
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              Most popular
            </div>
            <div
              style={{
                fontWeight: 800,
                color: '#FBD9D5',
                fontSize: 14,
                letterSpacing: 1,
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              Certified
            </div>
            <div
              style={{ fontSize: 13, fontWeight: 700, color: '#FBD9D5', opacity: 0.85, marginBottom: 2 }}
            >
              Starting rate
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 18 }}>
              <span style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-1.5px' }}>£25</span>
              <span style={{ color: '#FBD9D5', fontWeight: 700 }}>/ page</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 26 }}>
              {data.certFeatures.map((f) => (
                <div
                  key={f}
                  style={{ display: 'flex', gap: 9, fontSize: 15, fontWeight: 600, color: '#FFF1F0' }}
                >
                  <span style={{ fontWeight: 900 }}>✓</span>
                  {f}
                </div>
              ))}
            </div>
            <a
              href={QUOTE_URL}
              className="btn-light"
              style={{
                display: 'block',
                textAlign: 'center',
                textDecoration: 'none',
                width: '100%',
                color: '#E8382B',
                fontWeight: 800,
                fontSize: 16,
                padding: 15,
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
              }}
            >
              Get Certified Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  9. Samples                                                         */
/* ------------------------------------------------------------------ */

function Samples() {
  return (
    <section style={{ padding: '88px 0', background: '#FBF3F1' }}>
      <div className="section-pad" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ ...heading, margin: 0 }}>Our Translation Samples</h2>
        </div>
        <div
          className="grid-4"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 22,
            marginBottom: 44,
          }}
        >
          {data.samples.map((s) => (
            <div
              key={s.pair}
              style={{
                background: '#fff',
                borderRadius: 18,
                overflow: 'hidden',
                border: '1px solid #F1E1DE',
                boxShadow: '0 12px 26px rgba(138,32,24,0.05)',
              }}
            >
              <div
                style={{
                  aspectRatio: '4 / 3',
                  background: '#FBF8F7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 14,
                }}
              >
                <Img
                  src={s.img}
                  alt={`${s.pair} translation sample`}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#8A857F', fontWeight: 700, marginBottom: 12 }}>
                  {s.pair}
                </div>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontWeight: 800, fontSize: 14, color: '#E8382B' }}
                >
                  View Sample →
                </a>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <CTA>Order My Translation</CTA>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  10. Tech / localisation                                            */
/* ------------------------------------------------------------------ */

function TechLocalisation() {
  return (
    <section style={{ padding: '80px 0', background: '#fff' }}>
      <div className="section-pad" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px' }}>
        <div
          className="grid-tech tech-box"
          style={{
            background: 'linear-gradient(135deg,#FDF1EF,#FBF8F7)',
            borderRadius: 24,
            padding: 48,
            border: '1px solid #F3E4E1',
            display: 'grid',
            gridTemplateColumns: '1.3fr 1fr',
            gap: 40,
            alignItems: 'center',
          }}
        >
          <div>
            <h2 style={{ ...heading, margin: '0 0 14px' }}>
              Tech-Powered and Specialist Translations, Localisation, and Transcription Services
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: '#55504E', fontWeight: 600, margin: '0 0 24px' }}>
              From certified human translation for standard documents to human-assisted machine
              translation for desktop publishing, localisation, marketing materials, and more, we are
              the industry's most preferred choice. Our Professional Services can help you conquer the
              global market, from Wales and London in the UK to the US, France, the UAE, and
              Australia. Our team will assist you from start to finish, providing more than just
              support.
            </p>
            <a
              href="https://www.translations.co.uk/services/"
              className="btn-ghost"
              style={{
                display: 'inline-block',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: 16,
                padding: '14px 28px',
                border: '2px solid #E8382B',
                borderRadius: 999,
                cursor: 'pointer',
              }}
            >
              Explore All Services
            </a>
          </div>
          <div
            style={{
              aspectRatio: '1 / 1',
              borderRadius: 20,
              background: '#fff',
              border: '1px solid #F3E4E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
          >
            <Img
              src="uploads/professional-translation-services.webp"
              alt="Tech-powered localisation and transcription"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  11. Languages                                                      */
/* ------------------------------------------------------------------ */

function Languages() {
  return (
    <section style={{ padding: '88px 0', background: '#FBF3F1' }}>
      <div
        className="section-pad"
        style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}
      >
        <h2 style={heading}>Translate in 200+ Language Pairs</h2>
        <p
          style={{
            fontSize: 18,
            color: '#55504E',
            fontWeight: 600,
            margin: '0 auto 44px',
            maxWidth: 760,
          }}
        >
          We offer 200+ language translation services, including, but not limited to, the ones
          below. We also include Chinese, Arabic, Korean, Hindi, Bengali, and more. Get professional
          and certified language translation UK and worldwide for all administrative and unofficial
          purposes from us now!
        </p>
        <div
          className="grid-4"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 16,
            marginBottom: 40,
          }}
        >
          {data.languages.map((l) => (
            <div
              key={l.name}
              className="lang-card"
              style={{
                background: '#fff',
                borderRadius: 14,
                padding: 16,
                border: '1px solid #F1E1DE',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Img
                src={l.img}
                alt={l.name}
                style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
              <span style={{ fontWeight: 800, fontSize: 16 }}>{l.name}</span>
            </div>
          ))}
        </div>
        <CTA>Check My Language Pair — Get a Quote</CTA>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  12. ISO cert                                                       */
/* ------------------------------------------------------------------ */

function ISO() {
  return (
    <section style={{ padding: '80px 0', background: '#fff' }}>
      <div className="section-pad" style={{ maxWidth: 960, margin: '0 auto', padding: '0 32px' }}>
        <div
          className="grid-iso iso-box"
          style={{
            background: '#1C1C1C',
            borderRadius: 24,
            padding: 48,
            color: '#fff',
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: 40,
            alignItems: 'center',
          }}
        >
          <div className="iso-imgs" style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
            <Img
              src="uploads/Translation-services.png"
              alt="ISO 17100 Certified Translation Services"
              style={{ width: 130, height: 130, objectFit: 'contain' }}
            />
            <Img
              src="uploads/Post-Services.png"
              alt="ISO 18587 Certified Post-editing MT Output"
              style={{ width: 130, height: 130, objectFit: 'contain' }}
            />
          </div>
          <div>
            <h2 style={{ ...heading, color: '#fff' }}>Certified to International Standards</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: '#C9C4C0', fontWeight: 600, margin: '0 0 24px' }}>
              Our ISO 17100 and ISO 18587 certifications mean every translation follows a rigorous,
              audited quality process from qualified linguist to independent review.
            </p>
            <a
              href={QUOTE_URL}
              className="btn-primary"
              style={{
                display: 'inline-block',
                textDecoration: 'none',
                color: '#fff',
                fontWeight: 800,
                fontSize: 16,
                padding: '15px 30px',
                border: 'none',
                borderRadius: 999,
                cursor: 'pointer',
              }}
            >
              Work With ISO-Certified Experts
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  13. Process                                                        */
/* ------------------------------------------------------------------ */

function Process() {
  return (
    <section style={{ padding: '88px 0', background: '#FBF3F1' }}>
      <div className="section-pad" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={heading}>How to Avail Our Translation Services: Our Process</h2>
          <p
            style={{
              fontSize: 18,
              color: '#55504E',
              fontWeight: 600,
              margin: 0,
              maxWidth: 640,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Our process is designed for ultimate simplicity, transparency, and efficiency. Here's the
            6-step guide to how it works:
          </p>
        </div>
        <div
          className="grid-3"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 22,
            marginBottom: 44,
          }}
        >
          {data.processSteps.map((p) => (
            <div
              key={p.n}
              className="hover-card"
              style={{
                background: '#fff',
                borderRadius: 18,
                padding: 28,
                border: '1px solid #F1E1DE',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: '#E8382B',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {p.n}
                </div>
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 16,
                    background: '#FDECEA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Img
                    src={p.icon}
                    alt={p.title}
                    style={{ width: 38, height: 38, objectFit: 'contain' }}
                  />
                </div>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 7px' }}>{p.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: '#6B655F', fontWeight: 600, margin: 0 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <CTA>Start Step 1 — Upload My Document</CTA>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  14. FAQ                                                            */
/* ------------------------------------------------------------------ */

function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <section style={{ padding: '88px 0', background: '#fff' }}>
      <div className="section-pad" style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={heading}>Frequently asked questions</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
          {data.faqData.map((f, i) => {
            const isOpen = i === open
            return (
              <div
                key={f.q}
                style={{
                  background: '#FBF8F7',
                  borderRadius: 14,
                  border: '1px solid #EEE4E1',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    padding: '20px 24px',
                    fontSize: 17,
                    fontWeight: 800,
                    color: '#1C1C1C',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  {f.q}
                  <span style={{ color: '#E8382B', fontSize: 22, flexShrink: 0 }}>
                    {isOpen ? '–' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: '0 24px 22px',
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: '#55504E',
                      fontWeight: 600,
                    }}
                  >
                    {f.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div style={{ textAlign: 'center' }}>
          <CTA>Get a Free, No-Obligation Quote</CTA>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer style={{ background: '#141414', color: '#9C9691', padding: '48px 0 110px' }}>
      <div
        className="section-pad footer-row"
        style={{
          maxWidth: 1160,
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <a
          href="https://www.translations.co.uk/"
          style={{ background: '#fff', borderRadius: 12, padding: '10px 16px', display: 'inline-flex' }}
        >
          <Img
            src="uploads/logo.webp"
            alt="translations.co.uk"
            style={{ height: 32, width: 'auto', display: 'block' }}
          />
        </a>
        <div style={{ display: 'flex', gap: 24, fontSize: 14, fontWeight: 700, flexWrap: 'wrap' }}>
          <a
            href={`tel:${PHONE_TEL}`}
            style={{ color: '#C9C4C0', display: 'inline-flex', alignItems: 'center', gap: 7 }}
          >
            <PhoneIcon size={15} color="#C9C4C0" /> {PHONE}
          </a>
          <a
            href={`mailto:${EMAIL}`}
            style={{ color: '#C9C4C0', display: 'inline-flex', alignItems: 'center', gap: 7 }}
          >
            <MailIcon size={15} color="#C9C4C0" /> {EMAIL}
          </a>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>
          © 2026 translations.co.uk · ISO 17100 &amp; 18587 Certified
        </div>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/*  15. Sticky mobile bar                                              */
/* ------------------------------------------------------------------ */

function MobileBar() {
  const narrow = useNarrow(820)
  if (!narrow) return null
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        background: '#fff',
        borderTop: '1px solid #EEDEDB',
        boxShadow: '0 -6px 24px rgba(0,0,0,0.1)',
        padding: '12px 16px',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
      }}
    >
      <a
        href={`tel:${PHONE_TEL}`}
        aria-label="Call us"
        style={{
          flexShrink: 0,
          width: 52,
          height: 52,
          borderRadius: 14,
          background: '#FDECEA',
          color: '#E8382B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <PhoneIcon size={24} color="#E8382B" />
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          flexShrink: 0,
          width: 52,
          height: 52,
          borderRadius: 14,
          background: '#25D366',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <WhatsAppIcon size={26} />
      </a>
      <a
        href={QUOTE_URL}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          background: '#E8382B',
          color: '#fff',
          fontWeight: 800,
          fontSize: 16,
          padding: 16,
          border: 'none',
          borderRadius: 14,
          cursor: 'pointer',
        }}
      >
        Get My Free Quote
      </a>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Floating WhatsApp button (desktop only; on mobile it lives in the  */
/*  sticky bottom bar to avoid overlapping the hero CTA / LiveChat).    */
/* ------------------------------------------------------------------ */

const WhatsAppIcon = ({ size = 30 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

function WhatsAppButton() {
  const narrow = useNarrow(820)
  if (narrow) return null // on mobile it's shown inside the sticky bar instead
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="wa-fab"
      style={{
        position: 'fixed',
        left: 24,
        bottom: 24,
        zIndex: 58,
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        boxShadow: '0 6px 18px rgba(0,0,0,0.28)',
      }}
    >
      <WhatsAppIcon size={30} />
    </a>
  )
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

export default function App() {
  return (
    <div
      className="page"
      style={{
        fontFamily: "'Poppins','Poppins-fallback',system-ui,sans-serif",
        background: '#FBF8F7',
        overflowX: 'hidden',
      }}
    >
      <Header />
      <Hero />
      <TrustStrip />
      <OfficialTrust />
      <Intro />
      <Solutions />
      <WhyChoose />
      <SocialProof />
      <Pricing />
      <Samples />
      <TechLocalisation />
      <Languages />
      <ISO />
      <Process />
      <FAQ />
      <Footer />
      <MobileBar />
      <WhatsAppButton />
    </div>
  )
}
