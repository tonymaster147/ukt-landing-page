import { useState, useEffect, useId, Fragment } from 'react'
import * as data from './data.js'
import {
  PHONE,
  PHONE_TEL,
  EMAIL,
  QUOTE_URL,
  SUBMIT_ENDPOINT,
  THANK_YOU_URL,
  WHATSAPP_URL,
  LIVECHAT_URL,
} from './data.js'

const MAX = 1200

/* ------------------------------------------------------------------ */
/*  Image — native lazy-load, always visible. Deterministic markup so   */
/*  it prerenders into the static HTML and hydrates without mismatch.   */
/* ------------------------------------------------------------------ */

function Img({ src, alt = '', style, ...rest }) {
  return <img src={src} alt={alt} loading="lazy" decoding="async" {...rest} style={style} />
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
  // Start false on both server and first client render (so hydration matches),
  // then measure the real viewport after mount.
  const [narrow, setNarrow] = useState(false)
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
            <span className="cta-full">Get Your Translation</span>
            <span className="cta-short">Get Your Translation</span>
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

// Normalise a UK phone number to E.164 (+447…) for Google Enhanced Conversions.
function toE164UK(raw) {
  const d = String(raw || '').replace(/\D/g, '')
  if (!d) return ''
  if (d.startsWith('44')) return '+' + d
  if (d.startsWith('0')) return '+44' + d.slice(1)
  return '+44' + d
}

function QuoteForm() {
  const [step, setStep] = useState(1)
  const [step1Data, setStep1Data] = useState({})
  const [files, setFiles] = useState([])
  const [captchaError, setCaptchaError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  // Deterministic on the server and on the first client render so the
  // prerendered HTML hydrates without a mismatch; randomised right after mount,
  // and again on a wrong answer.
  const [cap, setCap] = useState({ a: 3, b: 4 })
  const newCaptcha = () => setCap({ a: randDigit(), b: randDigit() })
  useEffect(() => {
    setCap({ a: randDigit(), b: randDigit() })
  }, [])

  // Step 1 = documents + language pair. Capture them before the step unmounts.
  const goToStep2 = () => {
    const form = document.querySelector('#quote-form form')
    if (form && !form.reportValidity()) return
    const el = form.elements
    setStep1Data({
      from: el['from'] ? el['from'].value.trim() : '',
      to: el['to'] ? el['to'].value.trim() : '',
    })
    const fileInput = el['files']
    setFiles(fileInput && fileInput.files ? Array.from(fileInput.files).slice(0, 10) : [])
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

    const emailNorm = ((el['email'] && el['email'].value) || '').trim().toLowerCase()
    const phoneNorm = toE164UK((el['phone'] && el['phone'].value) || '')

    // Build the submission: name/email/phone/purpose from step 2 (DOM),
    // language pair from step 1 (state), files captured in step 1 (state).
    const fd = new FormData()
    fd.append('name', (el['name'] && el['name'].value.trim()) || '')
    fd.append('email', emailNorm)
    fd.append('phone', (el['phone'] && el['phone'].value.trim()) || '')
    fd.append('from', step1Data.from || '')
    fd.append('to', step1Data.to || '')
    fd.append('purpose', '')
    fd.append('description', (el['description'] && el['description'].value.trim()) || '')
    fd.append('captcha', (el['captcha'] && el['captcha'].value) || '')
    fd.append('captcha_a', String(cap.a))
    fd.append('captcha_b', String(cap.b))

    // Attach the documents uploaded in step 1 (up to 10).
    files.forEach((file) => fd.append('files[]', file, file.name))

    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch(SUBMIT_ENDPOINT, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success) {
        /* ---------------- Enhanced Conversions ----------------
           Google Ads diagnostics asked for "in-page code in addition to
           Automatic". Automatic detection can't work here because the
           conversion fires on /thank-you-two/, which has no form fields to
           scrape — hence 0% coverage. So we hand the Google tag the
           user-provided data explicitly, normalised the way Google expects:
           email lower-cased/trimmed, phone in E.164, name split, empty
           fields omitted entirely (never sent as ''). */
        const fullName = ((el['name'] && el['name'].value) || '').trim().replace(/\s+/g, ' ')
        const parts = fullName ? fullName.split(' ') : []

        const userData = {}
        if (emailNorm) userData.email = emailNorm
        if (phoneNorm) userData.phone_number = phoneNorm
        if (parts.length) {
          userData.address = {
            first_name: parts[0],
            last_name: parts.length > 1 ? parts.slice(1).join(' ') : '',
            country: 'GB',
          }
        }

        // Still stash for the thank-you page (same origin) as a fallback.
        try {
          sessionStorage.setItem('lead_email', emailNorm)
          sessionStorage.setItem('lead_phone', phoneNorm)
          sessionStorage.setItem('lead_user_data', JSON.stringify(userData))
        } catch (e) {
          /* sessionStorage may be unavailable; ignore */
        }

        window.dataLayer = window.dataLayer || []
        // gtag may not exist yet (third-party scripts load lazily). The shim
        // queues the command so gtag.js applies it as soon as it loads.
        if (typeof window.gtag !== 'function') {
          window.gtag = function () {
            window.dataLayer.push(arguments)
          }
        }
        // In-page enhanced-conversions data for the Google tag.
        window.gtag('set', 'user_data', userData)

        /* Don't navigate until the tags have had a chance to fire. Previously
           we redirected on the very next line, so GTM was often killed by the
           page unload before the conversion tag ran. eventCallback fires once
           GTM has finished (or hits eventTimeout); the setTimeout guarantees
           the visitor still reaches the thank-you page if GTM never answers. */
        let navigated = false
        const go = () => {
          if (navigated) return
          navigated = true
          window.location.href = THANK_YOU_URL
        }
        window.dataLayer.push({
          event: 'lead_submit',
          user_data: userData,
          eventCallback: go,
          eventTimeout: 1500,
        })
        setTimeout(go, 1600)
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
              <span style={{ fontSize: 13, fontWeight: 800, color: '#1C1C1C' }}>Documents</span>
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
                Your details
              </span>
            </div>
          </div>

          <form onSubmit={onFormSubmit}>
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <label
                  className="upload-box"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '30px 16px',
                    border: '1.5px dashed #D8C7C3',
                    borderRadius: 12,
                    background: '#FCFAFA',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: 26, color: '#B0857E' }}>🗂</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#3A3634' }}>
                    Click or drag your document to upload.
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#A79F9A' }}>
                    You can upload up to 10 files.
                  </span>
                  <input name="files" type="file" multiple style={{ display: 'none' }} />
                </label>
                <div
                  className="form-row-2"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}
                >
                  <input name="from" placeholder="From Language" className="field" style={field} />
                  <input name="to" placeholder="To Language" className="field" style={field} />
                </div>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input name="name" placeholder="Name" required className="field" style={field} />
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
                <textarea
                  name="description"
                  placeholder="Purpose and Instructions"
                  rows={3}
                  className="field"
                  style={{ ...field, resize: 'vertical', fontFamily: 'inherit' }}
                />
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
                lineHeight: 1.6,
                margin: '16px 0 0',
              }}
            >
              🔒 Your documents remain confidential.
              <br />
              No spam.
              <br />
              Response within 10 minutes.
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
  const narrow = useNarrow(640)
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
              fontSize: 46,
              lineHeight: 1.1,
              fontWeight: 700,
              letterSpacing: '-1.2px',
              margin: '0 0 18px',
            }}
          >
            Certified UK Document Translations with{' '}
            <span style={{ color: '#E8382B' }}>97.58% Acceptance Rate</span>
          </h1>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              color: '#55504E',
              maxWidth: 540,
              margin: '0 0 22px',
            }}
          >
            Official document translations accepted by the UK Home Office, courts, universities
            and UKVI — accurate, fast and translated by human experts.
          </p>
          <ul
            className="hero-bullets"
            style={{
              listStyle: 'none',
              margin: '0 0 20px',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 11,
            }}
          >
            {[
              'UK Government Accepted',
              'Same-Day & 24-Hour Delivery',
              'Human Certified Translators',
              'Starting from £15 (No Hidden Fees)',
            ].map((item) => (
              <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    flexShrink: 0,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: '#E7F6ED',
                    color: '#1F8A5B',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 900,
                  }}
                >
                  ✓
                </span>
                <span style={{ fontSize: 16, fontWeight: 600, color: '#3A3634' }}>{item}</span>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 26 }}>
            <Stars size={18} spacing={1} />
            <span style={{ fontWeight: 700, fontSize: 15, color: '#1C1C1C' }}>
              Rated 4.9/5 by 2,000+ UK Customers
            </span>
          </div>
          {/* On mobile both CTAs go full width and stack, so they line up. */}
          <div
            style={{
              display: 'flex',
              flexDirection: narrow ? 'column' : 'row',
              alignItems: narrow ? 'stretch' : 'center',
              gap: narrow ? 12 : 14,
              flexWrap: 'wrap',
            }}
          >
            <a
              href={QUOTE_URL}
              className="btn-primary"
              style={{
                display: 'block',
                textAlign: 'center',
                textDecoration: 'none',
                color: '#fff',
                fontWeight: 800,
                fontSize: 17,
                padding: '16px 30px',
                border: 'none',
                borderRadius: 999,
                cursor: 'pointer',
                boxShadow: '0 10px 24px rgba(232,56,43,0.28)',
                width: narrow ? '100%' : 'auto',
              }}
            >
              Upload Your Document
            </a>
            <a
              href={LIVECHAT_URL}
              target="_blank"
              rel="noopener"
              className="btn-ghost"
              style={{
                display: 'block',
                textAlign: 'center',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: 16,
                padding: narrow ? '16px 26px' : '14px 26px',
                border: '2px solid #E8382B',
                borderRadius: 999,
                cursor: 'pointer',
                width: narrow ? '100%' : 'auto',
              }}
            >
              Talk to an Expert
            </a>
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

/* One logo tile. Falls back to a clean wordmark if the image file is
   missing, so the strip never shows a broken image. */
function LogoTile({ logo }) {
  const [failed, setFailed] = useState(!logo.src)

  return (
    <div
      style={{
        height: 104,
        borderRadius: 16,
        border: '1px solid #EFE2DF',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '18px 20px',
        textAlign: 'center',
      }}
    >
      {failed ? (
        <span
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: '#5A5450',
            letterSpacing: '-0.2px',
            lineHeight: 1.3,
          }}
        >
          {logo.label || logo.alt}
        </span>
      ) : (
        <Img
          src={logo.src}
          alt={logo.alt}
          onError={() => setFailed(true)}
          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
        />
      )}
    </div>
  )
}

function OfficialTrust() {
  return (
    <section className="trust-sec" style={{ padding: '70px 0 34px', background: '#fff' }}>
      <div
        className="section-pad"
        style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}
      >
        <h2 style={{ ...heading, marginBottom: 36 }}>
          Widely Accepted by UK Government Bodies &amp; Authorities
        </h2>

        {/* Institution logos */}
        <div
          className="grid-4"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 16,
            marginBottom: 26,
          }}
        >
          {data.trustLogos.map((lg) => (
            <LogoTile key={lg.alt} logo={lg} />
          ))}
        </div>

        {/* Certification note */}
        <p
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 15,
            fontWeight: 700,
            color: '#3A3634',
            margin: '0 0 26px',
          }}
        >
          <span style={{ color: '#1F8A5B', fontWeight: 900 }}>✓</span>
          Includes Official Certification Stamp, Translator Declaration &amp; Credentials
        </p>

        <div>
          <CTA>Start Your Translation</CTA>
        </div>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#8A857F', margin: '14px 0 0' }}>
          Home Office Compliant
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

const RED = '#E8382B'
const GREEN = '#1F8A5B'

function PlanLabel({ children }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: '1.2px',
        textTransform: 'uppercase',
        color: '#A79F9A',
        margin: '0 0 14px',
      }}
    >
      {children}
    </div>
  )
}

function PlanCard({ plan }) {
  const featured = plan.featured
  const narrow = useNarrow(880)

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        borderRadius: 26,
        overflow: 'hidden',
        border: featured ? `2px solid ${RED}` : '1px solid #EEE4E1',
        boxShadow: featured
          ? '0 34px 74px rgba(232,56,43,0.24)'
          : '0 12px 32px rgba(58,54,52,0.06)',
        transform: featured && !narrow ? 'translateY(-16px)' : 'none',
        zIndex: featured ? 1 : 0,
      }}
    >
      {/* ---- Header cap: solid red on the featured plan ---- */}
      <div
        className="card-pad"
        style={{
          background: featured ? 'linear-gradient(135deg,#F04A3D 0%,#C22A20 100%)' : '#FBF8F7',
          borderBottom: featured ? 'none' : '1px solid #F1E7E4',
          padding: '26px 30px 30px',
          textAlign: 'center',
        }}
      >
        {/* BADGE — full line from the brief. The unbadged plan gets a spacer
            of the same height so both price rows stay on the same baseline. */}
        {plan.badge ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#fff',
                color: RED,
                borderRadius: 999,
                padding: '10px 22px',
                fontSize: 12.5,
                fontWeight: 900,
                letterSpacing: '1.1px',
                textTransform: 'uppercase',
                lineHeight: 1.35,
                textAlign: 'center',
                maxWidth: '100%',
                boxShadow: '0 10px 24px rgba(0,0,0,0.22)',
              }}
            >
              <span style={{ fontSize: 15, flexShrink: 0 }}>⭐</span>
              {plan.badge}
            </span>
          </div>
        ) : (
          <div aria-hidden style={{ height: 42, marginBottom: 18 }} />
        )}

        <h3
          style={{
            fontSize: 19,
            fontWeight: 800,
            margin: '0 0 14px',
            color: featured ? 'rgba(255,255,255,0.92)' : '#3A3634',
            letterSpacing: '-0.2px',
          }}
        >
          {plan.name}
        </h3>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: featured ? 'rgba(255,255,255,0.8)' : '#8A857F',
            }}
          >
            From
          </span>
          <span
            style={{
              fontSize: 54,
              fontWeight: 900,
              letterSpacing: '-2.4px',
              lineHeight: 1,
              color: featured ? '#fff' : '#1C1C1C',
            }}
          >
            {plan.price}
          </span>
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: featured ? 'rgba(255,255,255,0.8)' : '#8A857F',
            }}
          >
            {plan.unit}
          </span>
        </div>

        <p
          style={{
            fontSize: 15,
            fontWeight: 600,
            margin: 0,
            lineHeight: 1.5,
            color: featured ? 'rgba(255,255,255,0.9)' : '#55504E',
          }}
        >
          {plan.blurb}
        </p>
      </div>

      {/* ---- Body ---- */}
      <div
        className="card-pad"
        style={{ padding: '28px 30px 30px', display: 'flex', flexDirection: 'column', flex: 1 }}
      >
      {/* Perfect for */}
      <PlanLabel>Perfect for</PlanLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {plan.perfectFor.map((f) => (
          <div
            key={f}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              fontSize: 15,
              fontWeight: 600,
              color: '#3A3634',
              lineHeight: 1.45,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: featured ? RED : '#C9BFBB',
                marginTop: 8,
                flexShrink: 0,
              }}
            />
            {f}
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: '#F1E7E4', margin: '0 0 22px' }} />

      {/* What's included */}
      <PlanLabel>What’s included</PlanLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {plan.included.map((f) => {
          const bolt = f.icon === 'bolt'
          return (
            <div
              key={f.text}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                fontSize: 15,
                fontWeight: f.strong ? 800 : 600,
                color: '#3A3634',
                lineHeight: 1.45,
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  flexShrink: 0,
                  marginTop: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 900,
                  background: bolt ? '#FFF3D6' : '#E5F4EC',
                  color: bolt ? '#B07C00' : GREEN,
                }}
              >
                {bolt ? '⚡' : '✓'}
              </span>
              {f.text}
            </div>
          )
        })}
      </div>

      {/* CTA pinned to the bottom so both cards line up */}
      <div style={{ marginTop: 'auto' }}>
        <a
          href={QUOTE_URL}
          className={featured ? 'btn-primary' : 'btn-dark'}
          style={{
            display: 'block',
            textAlign: 'center',
            textDecoration: 'none',
            width: '100%',
            color: '#fff',
            fontWeight: 800,
            fontSize: 16,
            padding: 16,
            border: 'none',
            borderRadius: 14,
            cursor: 'pointer',
          }}
        >
          {plan.cta}
        </a>
      </div>
      </div>
    </div>
  )
}

function Pricing() {
  const narrow = useNarrow(640)

  return (
    <section
      className="pricing-sec"
      style={{ padding: '38px 0 34px', background: 'linear-gradient(180deg,#fff 0%,#FBF3F1 100%)' }}
    >
      <div className="section-pad" style={{ maxWidth: 1020, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 52px' }}>
          <h2 style={{ ...heading, marginBottom: 14 }}>{data.pricingIntro.title}</h2>
          <p
            style={{
              fontSize: 16.5,
              fontWeight: 600,
              color: '#55504E',
              margin: '0 auto 20px',
              lineHeight: 1.6,
              maxWidth: 660,
            }}
          >
            {data.pricingIntro.sub}
          </p>

          {/* Assurance strip — compact icon + label row under the heading. */}
          <div
            style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: narrow ? 12 : 26,
              background: '#FBF6F5',
              border: '1px solid #F1E7E4',
              borderRadius: narrow ? 18 : 999,
              padding: narrow ? '12px 18px' : '11px 24px',
            }}
          >
            {data.pricingIntro.assurances.map((a) => (
              <span
                key={a.text}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 14.5,
                  fontWeight: 700,
                  color: '#55504E',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ color: '#1F8A5B', display: 'inline-flex', flexShrink: 0 }}>
                  <SpecIcon name={a.icon} size={16} />
                </span>
                {a.text}
              </span>
            ))}
          </div>
        </div>

        <div
          className="grid-2"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 26,
            alignItems: 'stretch',
            marginTop: 18,
          }}
        >
          {data.pricingPlans.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </div>

      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  8b. Specialist band — dark trust panel under the pricing cards     */
/* ------------------------------------------------------------------ */

function SpecIcon({ name, size = 19 }) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }
  if (name === 'shield')
    return (
      <svg {...p}>
        <path d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    )
  if (name === 'human')
    return (
      <svg {...p}>
        <circle cx="12" cy="8" r="3.4" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      </svg>
    )
  if (name === 'award')
    return (
      <svg {...p}>
        <circle cx="12" cy="9" r="5.2" />
        <path d="M8.6 13.4L7 21l5-2.4L17 21l-1.6-7.6" />
      </svg>
    )
  if (name === 'lock')
    return (
      <svg {...p}>
        <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.2" />
        <path d="M8.2 10.5V7.6a3.8 3.8 0 0 1 7.6 0v2.9" />
      </svg>
    )
  if (name === 'star')
    return (
      <svg {...p}>
        <path d="M12 3.6l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 17l-5.25 2.75 1-5.85L3.5 9.75l5.9-.85z" />
      </svg>
    )
  /* cert */
  return (
    <svg {...p}>
      <path d="M6 3h9l4 4v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M14.5 3v4.5H19" />
      <circle cx="11.5" cy="12.5" r="2.4" />
      <path d="M9.8 15.2L9 20l2.5-1.3L14 20l-.8-4.8" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Client reviews — autoplaying carousel below the pricing section    */
/* ------------------------------------------------------------------ */

const ThumbIcon = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 10.5v9M7 10.5l3.6-7.2a2 2 0 0 1 3.8 1.1L13.6 9h4.6a2 2 0 0 1 2 2.4l-1.3 6.2a2.4 2.4 0 0 1-2.3 1.9H7" />
    <rect x="2.5" y="10" width="4.5" height="10" rx="1.2" />
  </svg>
)

function ClientReviews() {
  const R = data.clientReviews
  const [index, setIndex] = useState(0)
  /* 3 on the server and on the first client render so hydration matches the
     desktop-first CSS; corrected right after mount. */
  const [per, setPer] = useState(3)
  const [paused, setPaused] = useState(false)
  const [open, setOpen] = useState({})

  // Mirrors the CSS breakpoints below, so the dots agree with what is on screen.
  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth
      setPer(w <= 767 ? 1 : w <= 1024 ? 2 : 3)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const pages = Math.max(1, R.items.length - per + 1)
  useEffect(() => {
    setIndex((i) => Math.min(i, pages - 1))
  }, [pages])

  // Autoplay, paused while the pointer is over the strip.
  useEffect(() => {
    if (paused || pages < 2) return undefined
    const t = setInterval(() => setIndex((i) => (i + 1) % pages), 3000)
    return () => clearInterval(t)
  }, [paused, pages])

  const toggle = (i) => setOpen((o) => ({ ...o, [i]: !o[i] }))

  return (
    <section
      className="reviews-sec"
      style={{
        padding: '30px 0 78px',
        background: 'linear-gradient(180deg,#FBF3F1 0%,#FFFFFF 62%,#F7FBF9 100%)',
      }}
    >
      <div className="section-pad" style={{ maxWidth: 1300, margin: '0 auto', padding: '0 32px' }}>
        <h2 style={{ ...heading, textAlign: 'center', margin: '0 auto 8px', maxWidth: 900 }}>
          {R.title}
        </h2>

        <div
          className="rv-viewport"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{ overflow: 'hidden', padding: '26px 0 8px' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'stretch',
              /* One card per step: the track shifts by exactly one card width,
                 which CSS derives from --rv-per at the current breakpoint. */
              transform: `translateX(calc(${-index} * 100% / var(--rv-per)))`,
              transition: 'transform .55s cubic-bezier(.4,0,.2,1)',
            }}
          >
            {R.items.map((r, i) => (
              <div key={r.name} className="rv-cell" style={{ padding: '14px 12px' }}>
                <article className="rv-card">
                  <div className="rv-head">
                    <span className="rv-avatar" aria-hidden="true">
                      {r.initials}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p className="rv-name">{r.name}</p>
                      <span className="rv-date">{r.date}</span>
                    </div>
                  </div>

                  <span
                    className="rv-stars"
                    role="img"
                    aria-label="Rated 5 out of 5"
                  />

                  <p className="rv-text">
                    {r.lead}{' '}
                    {open[i] ? (
                      <span>{r.rest}</span>
                    ) : (
                      <span className="rv-dots" aria-hidden="true">
                        …
                      </span>
                    )}
                  </p>

                  <button type="button" className="rv-more" onClick={() => toggle(i)}>
                    {open[i] ? R.readLess : R.readMore}
                  </button>

                  <div className="rv-foot">
                    <span className="rv-foot-item">
                      <ThumbIcon />
                      {R.usefulLabel}
                    </span>
                    <span className="rv-foot-item rv-report">{R.reportLabel}</span>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {pages > 1 ? (
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 18 }}
            role="tablist"
            aria-label="Reviews"
          >
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to review ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`rv-dot${i === index ? ' is-on' : ''}`}
              />
            ))}
          </div>
        ) : null}

        <div style={{ textAlign: 'center', marginTop: 34 }}>
          <CTA>Start Your Translation</CTA>
        </div>
      </div>
    </section>
  )
}

function SpecialistBand() {
  const b = data.specialistBand
  const narrow = useNarrow(880)

  return (
    <section
      style={{
        padding: narrow ? '52px 0' : '68px 0',
        background: 'linear-gradient(160deg,#16233A 0%,#0C1523 100%)',
      }}
    >
      <div className="section-pad" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px' }}>
        <div>
          {/* Headline + CTA */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 22,
              marginBottom: 30,
            }}
          >
            <div style={{ flex: '1 1 380px' }}>
              <h2
                style={{
                  fontSize: narrow ? 23 : 27,
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                  color: '#fff',
                  margin: '0 0 10px',
                  lineHeight: 1.3,
                }}
              >
                {b.title}
              </h2>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#A9B6C9', margin: 0, lineHeight: 1.6 }}>
                <a
                  href={LIVECHAT_URL}
                  target="_blank"
                  rel="noopener"
                  style={{ color: '#FF7A6E', fontWeight: 800, textDecoration: 'underline' }}
                >
                  {b.linkText}
                </a>{' '}
                {b.sub}
              </p>
            </div>
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
                borderRadius: 14,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {b.cta}
            </a>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.09)', marginBottom: 28 }} />

          {/* Trust badges */}
          <div
            className="grid-3"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}
          >
            {b.badges.map((x) => (
              <div
                key={x.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 14,
                  padding: '14px 16px',
                }}
              >
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 11,
                    flexShrink: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(232,56,43,0.16)',
                    color: '#FF8074',
                  }}
                >
                  <SpecIcon name={x.icon} />
                </span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#EAF0F8', lineHeight: 1.35 }}>
                  {x.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  8c. Comparison table — "Not all translation services are equal"    */
/* ------------------------------------------------------------------ */

const CMP_TONES = {
  good: { bg: 'rgba(45,190,126,0.16)', fg: '#63E0A6', mark: '✓' },
  warn: { bg: 'rgba(255,186,46,0.15)', fg: '#FFCF6B', mark: '?' },
  bad: { bg: 'rgba(255,99,84,0.15)', fg: '#FF9083', mark: '✕' },
}

function CmpBadge({ kind, children, compact }) {
  const t = CMP_TONES[kind]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: compact ? 'flex-start' : 'center',
        gap: compact ? 6 : 8,
        background: t.bg,
        color: t.fg,
        borderRadius: compact ? 11 : 999,
        padding: compact ? '7px 9px' : '7px 13px',
        fontSize: compact ? 12.5 : 14,
        fontWeight: 800,
        lineHeight: 1.3,
        /* Compact badges live in a narrow phone column: fill it, allow the
           text to wrap, and never let a long word ("Guaranteed") widen the
           grid track past the viewport. */
        ...(compact ? { display: 'flex', minWidth: 0, overflowWrap: 'anywhere' } : null),
      }}
    >
      <span
        style={{
          width: compact ? 15 : 17,
          height: compact ? 15 : 17,
          borderRadius: '50%',
          background: t.fg,
          color: '#0C1523',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          fontWeight: 900,
          flexShrink: 0,
          marginTop: compact ? 1 : 0,
        }}
      >
        {t.mark}
      </span>
      {children}
    </span>
  )
}

const CMP_COLS = '1.2fr 1fr 1fr 1.35fr'

function Comparison() {
  const c = data.comparison
  const narrow = useNarrow(880)

  const cell = { padding: '18px 20px', display: 'flex', alignItems: 'center' }
  const hdr = {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: '1.1px',
    textTransform: 'uppercase',
    color: '#7E8FA8',
    alignItems: 'flex-end',
  }

  return (
    <section
      style={{
        padding: '84px 0 88px',
        background: 'linear-gradient(180deg,#0C1523 0%,#111D31 100%)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="section-pad" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 44px' }}>
          <h2 style={{ ...heading, color: '#fff', marginBottom: 10 }}>{c.title}</h2>
          <p
            style={{
              fontSize: 17,
              fontStyle: 'italic',
              fontWeight: 600,
              color: '#8FA0B8',
              margin: '0 0 14px',
            }}
          >
            {c.kicker}
          </p>
          <p style={{ fontSize: 17, fontWeight: 700, color: '#D7E0EC', margin: 0, lineHeight: 1.55 }}>
            {c.lead}
          </p>
        </div>

        {narrow ? (
          /* ---------- Mobile: one card per feature ---------- */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {c.rows.map((r) => (
              <div
                key={r.feature}
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 18,
                  padding: 16,
                  background: 'rgba(255,255,255,0.04)',
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 800, color: '#EAF0F8', marginBottom: 14 }}>
                  {r.feature}
                </div>
                {/* Head-to-head: our column tinted red, theirs plain. Labels sit
                    above the badges so nothing wraps awkwardly on a phone. */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(232,56,43,0.12)',
                      border: '1px solid rgba(232,56,43,0.45)',
                      borderRadius: 13,
                      padding: '11px 11px 12px',
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10.5,
                        fontWeight: 900,
                        letterSpacing: '0.7px',
                        textTransform: 'uppercase',
                        color: '#FF8074',
                        marginBottom: 9,
                      }}
                    >
                      {c.cols.us}
                    </div>
                    <CmpBadge kind="good" compact>
                      {r.us}
                    </CmpBadge>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 13,
                      padding: '11px 11px 12px',
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10.5,
                        fontWeight: 900,
                        letterSpacing: '0.7px',
                        textTransform: 'uppercase',
                        color: '#7E8FA8',
                        marginBottom: 9,
                      }}
                    >
                      {c.cols.them}
                    </div>
                    <CmpBadge kind={r.tone} compact>
                      {r.them}
                    </CmpBadge>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#A9B6C9',
                    lineHeight: 1.5,
                    borderTop: '1px solid rgba(255,255,255,0.09)',
                    paddingTop: 12,
                  }}
                >
                  {r.why}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ---------- Desktop: comparison grid with a floating "us" column ---------- */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: CMP_COLS,
              gridTemplateRows: `auto repeat(${c.rows.length}, auto)`,
              position: 'relative',
              marginTop: 46,
              rowGap: 0,
            }}
          >
            {/* The highlighted column, floating above the table */}
            <div
              style={{
                gridColumn: 2,
                gridRow: `1 / ${c.rows.length + 2}`,
                background: 'rgba(232,56,43,0.10)',
                border: `2px solid ${RED}`,
                borderRadius: 22,
                boxShadow: '0 30px 64px rgba(232,56,43,0.28)',
                marginTop: -34,
                marginBottom: -14,
                zIndex: 0,
              }}
            />

            {/* Header row */}
            <div style={{ ...cell, ...hdr, gridColumn: 1, gridRow: 1 }}>{c.cols.feature}</div>
            <div
              style={{
                gridColumn: 2,
                gridRow: 1,
                zIndex: 1,
                position: 'relative',
                padding: '0 20px 18px',
                textAlign: 'left',
              }}
            >
              {/* BADGE — sits on top of the floating column */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: `linear-gradient(135deg,#F04A3D 0%,#C22A20 100%)`,
                  color: '#fff',
                  borderRadius: 999,
                  padding: '10px 22px',
                  fontSize: 12.5,
                  fontWeight: 900,
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 12px 26px rgba(232,56,43,0.42)',
                  marginTop: -20,
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 15 }}>⭐</span> Recommended
              </div>
              <div
                style={{ fontSize: 16, fontWeight: 900, color: '#FF8074', letterSpacing: '-0.2px' }}
              >
                {c.cols.us}
              </div>
            </div>
            <div style={{ ...cell, ...hdr, gridColumn: 3, gridRow: 1 }}>{c.cols.them}</div>
            <div style={{ ...cell, ...hdr, gridColumn: 4, gridRow: 1 }}>{c.cols.why}</div>

            {/* Body rows */}
            {c.rows.map((r, i) => {
              const row = i + 2
              const line = i === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)'
              return (
                <Fragment key={r.feature}>
                  <div
                    style={{
                      ...cell,
                      gridColumn: 1,
                      gridRow: row,
                      borderTop: line,
                      fontSize: 15,
                      fontWeight: 800,
                      color: '#EAF0F8',
                    }}
                  >
                    {r.feature}
                  </div>
                  <div
                    style={{
                      ...cell,
                      gridColumn: 2,
                      gridRow: row,
                      zIndex: 1,
                      position: 'relative',
                      borderTop: i === 0 ? 'none' : '1px solid rgba(232,56,43,0.22)',
                    }}
                  >
                    <CmpBadge kind="good">{r.us}</CmpBadge>
                  </div>
                  <div style={{ ...cell, gridColumn: 3, gridRow: row, borderTop: line }}>
                    <CmpBadge kind={r.tone}>{r.them}</CmpBadge>
                  </div>
                  <div
                    style={{
                      ...cell,
                      gridColumn: 4,
                      gridRow: row,
                      borderTop: line,
                      fontSize: 14.5,
                      fontWeight: 600,
                      color: '#A9B6C9',
                      lineHeight: 1.5,
                    }}
                  >
                    {r.why}
                  </div>
                </Fragment>
              )
            })}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 44 }}>
          <CTA>{c.cta}</CTA>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  8h. Quick quote — upload panel below the FAQ                       */
/*  Posts to the same PHP endpoint as the main form, so it fires the   */
/*  same two emails (lead notification + customer confirmation) and    */
/*  lands on the same thank-you page.                                  */
/* ------------------------------------------------------------------ */

const QQ_MAX_BYTES = 25 * 1024 * 1024

function QuickQuote() {
  const q = data.quickQuote
  const inputId = useId()
  const [files, setFiles] = useState([])
  const [over, setOver] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [cap, setCap] = useState({ a: 3, b: 4 })
  useEffect(() => {
    setCap({ a: randDigit(), b: randDigit() })
  }, [])

  const takeFiles = (list) => {
    const picked = Array.from(list || []).slice(0, 10)
    const tooBig = picked.find((f) => f.size > QQ_MAX_BYTES)
    if (tooBig) {
      setError(`“${tooBig.name}” is larger than 25MB. Please upload a smaller file.`)
      return
    }
    setError('')
    setFiles(picked)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    const el = e.target.elements

    const name = ((el['name'] && el['name'].value) || '').trim()
    const emailNorm = ((el['email'] && el['email'].value) || '').trim().toLowerCase()
    const phoneNorm = toE164UK((el['phone'] && el['phone'].value) || '')
    const answer = parseInt((el['captcha'] && el['captcha'].value) || '', 10)

    if (!files.length) return setError('Please attach your document first.')
    if (!name) return setError('Please enter your name.')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailNorm)) return setError('Please enter a valid email.')
    if (answer !== cap.a + cap.b) {
      setCap({ a: randDigit(), b: randDigit() })
      if (el['captcha']) el['captcha'].value = ''
      return setError('The captcha answer is incorrect.')
    }
    setError('')

    const fd = new FormData()
    fd.append('name', name)
    fd.append('email', emailNorm)
    fd.append('phone', (el['phone'] && el['phone'].value.trim()) || '')
    fd.append('from', '')
    fd.append('to', '')
    fd.append('purpose', 'Quick upload (below FAQ)')
    fd.append('description', '')
    fd.append('captcha', String(answer))
    fd.append('captcha_a', String(cap.a))
    fd.append('captcha_b', String(cap.b))
    files.forEach((f) => fd.append('files[]', f, f.name))

    setSubmitting(true)
    try {
      const res = await fetch(SUBMIT_ENDPOINT, { method: 'POST', body: fd })
      const json = await res.json()
      if (!json.success) {
        setError(json.message || 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      // Same Enhanced Conversions handling as the main form.
      const parts = name.replace(/\s+/g, ' ').split(' ')
      const userData = { email: emailNorm }
      if (phoneNorm) userData.phone_number = phoneNorm
      if (parts.length) {
        userData.address = {
          first_name: parts[0],
          last_name: parts.length > 1 ? parts.slice(1).join(' ') : '',
          country: 'GB',
        }
      }
      try {
        sessionStorage.setItem('lead_email', emailNorm)
        sessionStorage.setItem('lead_phone', phoneNorm)
      } catch (err) {
        /* ignore */
      }
      window.dataLayer = window.dataLayer || []
      if (typeof window.gtag !== 'function') {
        window.gtag = function () {
          window.dataLayer.push(arguments)
        }
      }
      window.gtag('set', 'user_data', userData)

      let navigated = false
      const go = () => {
        if (navigated) return
        navigated = true
        window.location.href = THANK_YOU_URL
      }
      window.dataLayer.push({
        event: 'lead_submit',
        user_data: userData,
        eventCallback: go,
        eventTimeout: 1500,
      })
      setTimeout(go, 1600)
    } catch (err) {
      setError('Network error — please check your connection and try again.')
      setSubmitting(false)
    }
  }

  const dark = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 11,
    padding: '13px 15px',
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
    outline: 'none',
  }

  return (
    <section style={{ padding: '70px 0', background: 'linear-gradient(180deg,#211D1E 0%,#171314 100%)' }}>
      <div
        className="section-pad"
        style={{ maxWidth: 640, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}
      >
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          {q.title}
        </h2>
        <p style={{ fontSize: 16, fontWeight: 600, color: '#C6BFBD', margin: '0 0 26px' }}>{q.sub}</p>

        <form onSubmit={onSubmit}>
          {/* Dropzone */}
          <label
            htmlFor={inputId}
            onDragOver={(e) => {
              e.preventDefault()
              setOver(true)
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setOver(false)
              takeFiles(e.dataTransfer.files)
            }}
            style={{
              display: 'block',
              border: `2px dashed ${over ? '#FF8074' : 'rgba(232,56,43,0.55)'}`,
              background: over ? 'rgba(232,56,43,0.10)' : 'rgba(255,255,255,0.03)',
              borderRadius: 14,
              padding: '30px 20px',
              cursor: 'pointer',
              marginBottom: 20,
            }}
          >
            <span
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                background: RED,
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}
            >
              <UploadCloudIcon />
            </span>
            <span style={{ display: 'block', fontSize: 14.5, fontWeight: 800, color: '#fff' }}>
              {files.length ? `${files.length} file${files.length > 1 ? 's' : ''} ready` : q.dropTitle}
            </span>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#9A928F', marginTop: 5 }}>
              {files.length ? files.map((f) => f.name).join(', ') : q.dropNote}
            </span>
          </label>
          <input
            id={inputId}
            name="files"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
            onChange={(e) => takeFiles(e.target.files)}
            style={{ display: 'none' }}
          />

          {/* Details appear once a document is attached — the API needs a name,
              a valid email and the captcha, and the confirmation email needs
              somewhere to go. */}
          {files.length > 0 && (
            <div style={{ display: 'grid', gap: 12, marginBottom: 20, textAlign: 'left' }}>
              <input name="name" placeholder="Your name" style={dark} />
              <input name="email" type="email" placeholder="Your email" style={dark} />
              <input name="phone" placeholder="Phone (optional)" style={dark} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 14.5, fontWeight: 700, color: '#C6BFBD', whiteSpace: 'nowrap' }}>
                  {cap.a} + {cap.b} =
                </span>
                <input name="captcha" inputMode="numeric" style={{ ...dark, width: 110 }} />
              </div>
            </div>
          )}

          {error && (
            <p style={{ fontSize: 14, fontWeight: 700, color: '#FF8074', margin: '0 0 16px' }}>{error}</p>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              border: 'none',
              color: '#fff',
              fontWeight: 800,
              fontSize: 15.5,
              padding: '15px 30px',
              borderRadius: 999,
              cursor: submitting ? 'wait' : 'pointer',
              opacity: submitting ? 0.75 : 1,
            }}
          >
            <UploadDocIcon />
            {submitting ? 'Sending…' : files.length ? q.ctaSend : q.cta}
          </button>
        </form>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 20,
            marginTop: 22,
          }}
        >
          {q.badges.map((b) => (
            <span
              key={b.text}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 13,
                fontWeight: 700,
                color: '#C6BFBD',
              }}
            >
              <span style={{ color: '#C6BFBD', display: 'inline-flex' }}>
                {b.icon === 'headset' ? (
                  <TrustIcon name="headset" size={15} />
                ) : (
                  <SpecIcon name={b.icon} size={15} />
                )}
              </span>
              {b.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function UploadCloudIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 18a4.5 4.5 0 0 1-.6-8.96 6 6 0 0 1 11.64-1.2A4 4 0 0 1 18 18" />
      <path d="M12 12v7M9.2 14.3L12 11.5l2.8 2.8" />
    </svg>
  )
}

function UploadDocIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5z" />
      <path d="M13.5 3v5.5H19M12 17v-5M9.6 14.4L12 12l2.4 2.4" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  8g. Language reach — regions with language pills                   */
/* ------------------------------------------------------------------ */

function RegionIcon({ name, size = 22 }) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }
  if (name === 'compass')
    return (
      <svg {...p}>
        <circle cx="12" cy="12" r="9" />
        <path d="M15.6 8.4l-2 5.2-5.2 2 2-5.2 5.2-2z" />
      </svg>
    )
  return (
    <svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.2 12h17.6M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  )
}

function LanguageReach() {
  const l = data.languageReach
  const narrow = useNarrow(880)

  return (
    <section
      style={{
        padding: '84px 0',
        background: 'linear-gradient(180deg,#FDF4F2 0%,#FBF3F1 100%)',
      }}
    >
      <div className="section-pad" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 44px' }}>
          <h2 style={{ ...heading, marginBottom: 14 }}>{l.title}</h2>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#55504E', margin: 0, lineHeight: 1.6 }}>
            {l.sub}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr' : '1fr 1fr',
            gap: 24,
            marginBottom: 44,
          }}
        >
          {l.regions.map((r) => (
            <div
              key={r.name}
              className="card-pad"
              style={{
                position: 'relative',
                overflow: 'hidden',
                background: '#fff',
                borderRadius: 22,
                padding: 26,
                boxShadow: '0 14px 34px rgba(58,54,52,0.06)',
              }}
            >
              {/* Soft decorative disc, top-right */}
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  top: -46,
                  right: -46,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: 'rgba(232,56,43,0.055)',
                }}
              />

              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 15,
                    flexShrink: 0,
                    background: '#FDECEA',
                    color: RED,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <RegionIcon name={r.icon} />
                </span>
                <div>
                  <h3
                    style={{
                      fontSize: narrow ? 21 : 24,
                      fontWeight: 800,
                      color: '#1C1C1C',
                      margin: '0 0 4px',
                      letterSpacing: '-0.5px',
                      lineHeight: 1.2,
                    }}
                  >
                    {r.name}
                  </h3>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: RED }}>{l.note}</div>
                </div>
              </div>

              <div
                style={{
                  position: 'relative',
                  background: '#FAFAFB',
                  borderRadius: 15,
                  padding: 16,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                }}
              >
                {r.langs.map((lang) => (
                  <span
                    key={lang}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      background: '#fff',
                      border: '1px solid #ECEEF2',
                      borderRadius: 999,
                      padding: '9px 15px',
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#3A3634',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#F08A80',
                        flexShrink: 0,
                      }}
                    />
                    {lang}
                  </span>
                ))}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    background: RED,
                    borderRadius: 999,
                    padding: '9px 16px',
                    fontSize: 14,
                    fontWeight: 800,
                    color: '#fff',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ fontWeight: 900 }}>+</span> {l.moreLabel}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <a
            href={QUOTE_URL}
            className="btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
              color: '#fff',
              fontWeight: 800,
              fontSize: 16,
              padding: '17px 34px',
              borderRadius: 999,
              cursor: 'pointer',
              boxShadow: '0 12px 28px rgba(232,56,43,0.3)',
            }}
          >
            {l.cta} <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  8f. Translation samples — tabbed gallery of certified layouts      */
/* ------------------------------------------------------------------ */

const SAMPLE_TONES = {
  green: { bg: '#E5F4EC', fg: '#177049' },
  blue: { bg: '#E7EFFC', fg: '#2A5DB0' },
  amber: { bg: '#FFF3D6', fg: '#8A6100' },
  indigo: { bg: '#ECEAFB', fg: '#4A3FA8' },
  red: { bg: '#FDEBE9', fg: '#C4382C' },
  teal: { bg: '#E3F5F3', fg: '#1A776E' },
}

function SampleGlyph({ name }) {
  return name === 'stamp' ? <TrustIcon name="stamp" size={16} /> : <AcceptIcon name={name} size={16} />
}

/* ------------------------------------------------------------------ */
/*  How it works — three red step cards, above the samples             */
/* ------------------------------------------------------------------ */

function HowIcon({ name, size = 42 }) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }
  if (name === 'upload')
    return (
      <svg {...p}>
        <rect x="2.5" y="3.5" width="19" height="14.5" rx="2.2" />
        <path d="M2.5 8h19" />
        <path d="M6 5.7h.01M8.3 5.7h.01" />
        <path d="M12 15.5v-4.6M9.9 12.8L12 10.7l2.1 2.1" />
        <path d="M15.4 17.6l2.6 2.9 1.2-1.6 1.8.4-2.4-3" />
      </svg>
    )
  if (name === 'quote')
    return (
      <svg {...p}>
        <rect x="2.5" y="4" width="19" height="13" rx="2.2" />
        <path d="M6.2 8h5M6.2 11h7M6.2 14h3.4" />
        <path d="M16.6 11.4v4.4M14.6 13.4h4" />
        <path d="M14.9 17.9l2.4 2.7 1.2-1.5 1.7.4-2.2-2.8" />
      </svg>
    )
  /* deliver */
  return (
    <svg {...p}>
      <path d="M14 3H6.5A2 2 0 0 0 4.5 5v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-8.5" />
      <path d="M14 3v5h5.5" />
      <path d="M7.6 12.4h5.2M7.6 15.4h3.6" />
      <circle cx="17.6" cy="16.6" r="4.2" />
      <path d="M15.8 16.6l1.3 1.3 2.4-2.6" />
    </svg>
  )
}

function HowItWorks() {
  const H = data.howItWorks
  return (
    <section className="how-sec" style={{ padding: '84px 0 34px', background: '#fff' }}>
      <div className="section-pad" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px' }}>
        <h2 style={{ ...heading, textAlign: 'center', margin: '0 auto 40px', maxWidth: 820 }}>
          {H.title}
        </h2>

        <div
          className="grid-3"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}
        >
          {H.steps.map((s, i) => (
            <div
              key={s.title}
              className="how-card"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '34px 26px 30px',
                borderRadius: 18,
                background: 'linear-gradient(160deg,#E03A2D 0%,#B62317 100%)',
                color: '#fff',
                boxShadow: '0 18px 40px -18px rgba(182,35,23,0.55)',
              }}
            >
              {/* Step number, quietly in the corner. */}
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 18,
                  fontSize: 13,
                  fontWeight: 900,
                  letterSpacing: '0.5px',
                  color: 'rgba(255,255,255,0.38)',
                }}
              >
                {`0${i + 1}`}
              </span>

              <span style={{ color: '#fff', marginBottom: 14, lineHeight: 0 }}>
                <HowIcon name={s.icon} />
              </span>

              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 800,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.72)',
                  marginBottom: 7,
                }}
              >
                {s.stage}
              </span>

              <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 12px', color: '#fff' }}>
                {s.title}
              </h3>

              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  fontWeight: 500,
                  margin: 0,
                  color: 'rgba(255,255,255,0.93)',
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TranslationSamples() {
  const s = data.translationSamples
  const narrow = useNarrow(640)
  const mid = useNarrow(1024)
  const cols = narrow ? '1fr' : mid ? '1fr 1fr' : 'repeat(3,1fr)'

  const bar = (w) => (
    <span style={{ display: 'block', height: 8, borderRadius: 5, background: '#E9EDF3', width: w }} />
  )

  return (
    <section className="samples-sec" style={{ padding: '30px 0 84px', background: '#fff' }}>
      <div className="section-pad" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 38px' }}>
          <h2 style={{ ...heading, marginBottom: 12 }}>{s.title}</h2>
          <p style={{ fontSize: 15.5, fontWeight: 600, color: '#55504E', margin: 0, lineHeight: 1.6 }}>
            {s.sub}
          </p>
        </div>

        {/* Sample cards */}
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 22 }}>
          {s.cards.map((c) => {
            const tone = SAMPLE_TONES[c.tone]
            return (
              <div
                key={c.title + c.pair}
                style={{
                  background: '#fff',
                  border: '1px solid #F1E7E4',
                  borderRadius: 18,
                  overflow: 'hidden',
                  boxShadow: '0 12px 30px rgba(58,54,52,0.06)',
                }}
              >
                {/* Mock document preview */}
                <div style={{ padding: 16, background: '#FBF8F7' }}>
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid #EEF1F5',
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                        marginBottom: 16,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 800,
                          letterSpacing: '0.7px',
                          textTransform: 'uppercase',
                          color: '#8A857F',
                        }}
                      >
                        {c.kicker}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 900,
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          background: tone.bg,
                          color: tone.fg,
                          borderRadius: 6,
                          padding: '5px 9px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {c.badge}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                      {bar('88%')}
                      {bar('100%')}
                      {bar('62%')}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                        borderTop: '1px solid #EEF1F5',
                        paddingTop: 13,
                      }}
                    >
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: '#9AA3AF' }}>
                        {c.footer}
                      </span>
                      <span style={{ color: RED, display: 'inline-flex', flexShrink: 0 }}>
                        <SampleGlyph name={c.icon} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: '18px 20px 22px' }}>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: '#1C1C1C',
                      margin: '0 0 8px',
                      letterSpacing: '-0.2px',
                    }}
                  >
                    {c.title}
                  </h3>
                  <p style={{ fontSize: 14.5, fontWeight: 700, color: '#5B6472', margin: '0 0 18px' }}>
                    {c.pair}
                  </p>

                  {c.url ? (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        textDecoration: 'none',
                        border: `1px solid ${RED}`,
                        color: RED,
                        borderRadius: 10,
                        padding: '11px 14px',
                        fontSize: 14.5,
                        fontWeight: 800,
                      }}
                    >
                      <EyeIcon /> View Translation Sample
                    </a>
                  ) : (
                    <span
                      aria-disabled="true"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        border: '1px solid #EFE2DF',
                        color: '#B9B2AF',
                        borderRadius: 10,
                        padding: '11px 14px',
                        fontSize: 14.5,
                        fontWeight: 800,
                      }}
                    >
                      <EyeIcon /> View Translation Sample
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function EyeIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  8e. Why applicants & businesses trust us — dark reasons grid       */
/* ------------------------------------------------------------------ */

function TrustIcon({ name, size = 20 }) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }
  if (name === 'stamp')
    return (
      <svg {...p}>
        <path d="M9 3.5h6a2.5 2.5 0 0 1 2.5 2.5c0 1.6-1.2 2.3-1.7 3.4-.3.7-.3 1.4-.3 2.1H8.5c0-.7 0-1.4-.3-2.1C7.7 8.3 6.5 7.6 6.5 6A2.5 2.5 0 0 1 9 3.5z" />
        <rect x="4" y="13.5" width="16" height="4" rx="1.4" />
        <path d="M4.6 20.5h14.8" />
      </svg>
    )
  if (name === 'truck')
    return (
      <svg {...p}>
        <path d="M2.5 6.5h11v9h-11z" />
        <path d="M13.5 10h3.6l2.9 3v2.5h-6.5z" />
        <circle cx="7" cy="18" r="1.9" />
        <circle cx="17" cy="18" r="1.9" />
      </svg>
    )
  if (name === 'tag')
    return (
      <svg {...p}>
        <path d="M3.5 11.2V4.5a1 1 0 0 1 1-1h6.7a1 1 0 0 1 .7.3l8 8a1 1 0 0 1 0 1.4l-6.7 6.7a1 1 0 0 1-1.4 0l-8-8a1 1 0 0 1-.3-.7z" />
        <circle cx="7.8" cy="7.8" r="1.4" />
      </svg>
    )
  if (name === 'shieldLock')
    return (
      <svg {...p}>
        <path d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6l7-3z" />
        <rect x="9.4" y="11" width="5.2" height="4.2" rx="1" />
        <path d="M10.5 11V9.9a1.5 1.5 0 0 1 3 0V11" />
      </svg>
    )
  if (name === 'headset')
    return (
      <svg {...p}>
        <path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" />
        <rect x="2.8" y="13.5" width="4" height="5.4" rx="1.6" />
        <rect x="17.2" y="13.5" width="4" height="5.4" rx="1.6" />
        <path d="M19.2 18.9v.6a2.2 2.2 0 0 1-2.2 2.2h-2.6" />
      </svg>
    )
  /* personCheck */
  return (
    <svg {...p}>
      <circle cx="10" cy="8" r="3.6" />
      <path d="M3.6 20a6.4 6.4 0 0 1 11.2-4.2" />
      <path d="M15.4 18.4l1.9 1.9 3.4-3.6" />
    </svg>
  )
}

function TrustReasons() {
  const t = data.trustReasons
  const narrow = useNarrow(640)
  const mid = useNarrow(1024)
  const cols = narrow ? '1fr' : mid ? '1fr 1fr' : 'repeat(3,1fr)'

  return (
    <section
      style={{
        padding: '84px 0',
        background: 'linear-gradient(180deg,#191617 0%,#131011 100%)',
      }}
    >
      <div className="section-pad" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 44px' }}>
          <h2 style={{ ...heading, color: '#fff', marginBottom: 14 }}>{t.title}</h2>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#B3ACAA', margin: 0, lineHeight: 1.6 }}>
            {t.sub}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 20, marginBottom: 26 }}>
          {t.cards.map((c) => (
            <div
              key={c.title}
              style={{
                background: 'rgba(255,255,255,0.035)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18,
                padding: 26,
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(232,56,43,0.16)',
                  color: '#FF6A5C',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 22,
                }}
              >
                <TrustIcon name={c.icon} />
              </span>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#fff',
                  margin: '0 0 14px',
                  lineHeight: 1.3,
                  letterSpacing: '-0.3px',
                }}
              >
                {c.title}
              </h3>
              <p
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: '#A39C9A',
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                {c.text}
              </p>
            </div>
          ))}
        </div>

        {/* Closing bar */}
        <div
          className="card-pad"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 18,
            background: 'rgba(255,255,255,0.035)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: narrow ? 22 : '24px 28px',
          }}
        >
          <div style={{ flex: '1 1 320px' }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: '#fff',
                marginBottom: 8,
                letterSpacing: '-0.3px',
              }}
            >
              {t.barTitle}
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#A39C9A' }}>
              🔒 {t.barNote}
            </div>
          </div>
          <a
            href={QUOTE_URL}
            className="btn-primary"
            style={{
              display: 'block',
              textAlign: 'center',
              textDecoration: 'none',
              color: '#fff',
              fontWeight: 800,
              fontSize: 15.5,
              padding: '15px 28px',
              borderRadius: 999,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              width: narrow ? '100%' : 'auto',
            }}
          >
            {t.cta}
          </a>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  8d. Acceptance — "Need your translation accepted the first time?"  */
/* ------------------------------------------------------------------ */

function AcceptIcon({ name, size = 17 }) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }
  if (name === 'cap')
    return (
      <svg {...p}>
        <path d="M12 4l9.5 4.5L12 13 2.5 8.5 12 4z" />
        <path d="M6.5 10.6V15c0 1.6 2.5 3 5.5 3s5.5-1.4 5.5-3v-4.4" />
      </svg>
    )
  if (name === 'baby')
    return (
      <svg {...p}>
        <circle cx="12" cy="8" r="4" />
        <path d="M9.8 8.2h.01M14.2 8.2h.01M10.3 10.4c1 .8 2.4.8 3.4 0" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
    )
  if (name === 'rings')
    return (
      <svg {...p}>
        <circle cx="9" cy="14.5" r="5" />
        <circle cx="15" cy="14.5" r="5" />
        <path d="M12 4.5l2 2.5h-4l2-2.5z" />
      </svg>
    )
  if (name === 'licence')
    return (
      <svg {...p}>
        <rect x="2.5" y="5" width="19" height="14" rx="2.4" />
        <circle cx="8.5" cy="11" r="2.1" />
        <path d="M5.4 16.4c.7-1.5 4.5-1.5 5.2 0M14.5 10h4.5M14.5 13.5h3" />
      </svg>
    )
  if (name === 'gavel')
    return (
      <svg {...p}>
        <path d="M13.6 4.4l6 6M16.6 1.4l6 6M15.1 8.9l-8 8M4 20.5h8" />
        <path d="M9.4 11.2l3.4 3.4" />
      </svg>
    )
  if (name === 'briefcase')
    return (
      <svg {...p}>
        <rect x="2.5" y="7.5" width="19" height="12.5" rx="2.2" />
        <path d="M8.5 7.5V5.8a1.8 1.8 0 0 1 1.8-1.8h3.4a1.8 1.8 0 0 1 1.8 1.8v1.7M2.5 12.5h19" />
      </svg>
    )
  /* passport */
  return (
    <svg {...p}>
      <rect x="4.5" y="2.5" width="15" height="19" rx="2.4" />
      <circle cx="12" cy="9.5" r="3.2" />
      <path d="M8.8 17.2h6.4" />
    </svg>
  )
}

function Acceptance() {
  const a = data.acceptance
  const narrow = useNarrow(640)
  const mid = useNarrow(1024)

  // Reference layout: 4 cards on the first row, 3 wider ones on the second.
  const cols = narrow ? '1fr' : mid ? '1fr 1fr' : 'repeat(12,1fr)'
  const spanFor = (i) => (narrow || mid ? 'auto' : i < 4 ? 'span 3' : 'span 4')

  return (
    <section style={{ padding: '84px 0', background: '#fff' }}>
      <div className="section-pad" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 40px' }}>
          <h2 style={{ ...heading, marginBottom: 14 }}>{a.title}</h2>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#55504E', margin: 0, lineHeight: 1.6 }}>
            {a.sub}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 18, marginBottom: 26 }}>
          {a.cards.map((c, i) => (
            <div
              key={c.title}
              style={{
                gridColumn: spanFor(i),
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                border: '1px solid #F1E1DE',
                borderRadius: 16,
                padding: 22,
                boxShadow: '0 8px 22px rgba(58,54,52,0.04)',
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 11,
                  background: '#FDECEA',
                  color: RED,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <AcceptIcon name={c.icon} />
              </span>

              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: '#1C1C1C',
                  margin: '0 0 10px',
                  lineHeight: 1.3,
                  letterSpacing: '-0.2px',
                }}
              >
                {c.title}
              </h3>

              <p
                style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: RED,
                  margin: '0 0 10px',
                  lineHeight: 1.45,
                }}
              >
                {c.badge}
              </p>

              <p
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'flex-start',
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: '#55504E',
                  margin: 0,
                  lineHeight: 1.55,
                }}
              >
                <span style={{ color: RED, fontWeight: 900, flexShrink: 0 }}>✓</span>
                {c.text}
              </p>
            </div>
          ))}
        </div>

        {/* Closing bar */}
        <div
          className="card-pad"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 18,
            background: '#fff',
            border: '1px solid #F1E1DE',
            borderRadius: 16,
            padding: narrow ? 22 : '24px 28px',
            boxShadow: '0 10px 26px rgba(58,54,52,0.05)',
          }}
        >
          <div style={{ flex: '1 1 340px' }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: '#1C1C1C',
                marginBottom: 8,
                letterSpacing: '-0.3px',
              }}
            >
              {a.barTitle}
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#8A857F' }}>
              <span style={{ color: RED }}>🛡</span> {a.barNote}
            </div>
          </div>
          <a
            href={QUOTE_URL}
            className="btn-primary"
            style={{
              display: 'block',
              textAlign: 'center',
              textDecoration: 'none',
              color: '#fff',
              fontWeight: 800,
              fontSize: 15.5,
              padding: '15px 28px',
              borderRadius: 999,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              width: narrow ? '100%' : 'auto',
            }}
          >
            {a.cta}
          </a>
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
          <CTA>Start Your Translation</CTA>
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
          style={{ background: '#fff', borderRadius: 14, padding: '14px 22px', display: 'inline-flex' }}
        >
          <Img
            src="uploads/logo.webp"
            alt="translations.co.uk"
            className="footer-logo"
            style={{ height: 46, width: 'auto', display: 'block' }}
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
        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.7 }}>
          <div>{data.footerInfo.address}</div>
          <div>{data.footerInfo.companyNumber}</div>
          <div>© 2026 translations.co.uk · ISO 17100 Certified</div>
        </div>
      </div>
      <div
        className="section-pad"
        style={{
          maxWidth: 1160,
          margin: '22px auto 0',
          padding: '18px 32px 0',
          borderTop: '1px solid #2A2A2A',
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          flexWrap: 'wrap',
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        <a href="https://www.translations.co.uk/about-us/" style={{ color: '#C9C4C0' }}>
          About Us
        </a>
        <a href="https://www.translations.co.uk/privacy-policy/" style={{ color: '#C9C4C0' }}>
          Privacy Policy
        </a>
        <a href="https://www.translations.co.uk/terms-and-conditions/" style={{ color: '#C9C4C0' }}>
          Terms &amp; Conditions
        </a>
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
        Order Now
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
      <OfficialTrust />
      <Pricing />
      <ClientReviews />
      <SpecialistBand />
      <Comparison />
      <Acceptance />
      <TrustReasons />
      <HowItWorks />
      <TranslationSamples />
      <LanguageReach />
      {/* Removed from the page (components kept in this file so they can be
          restored by re-adding a single line): Solutions, WhyChoose,
          SocialProof, Samples, TechLocalisation, Languages, ISO, Process. */}
      <FAQ />
      <QuickQuote />
      <Footer />
      <MobileBar />
      <WhatsAppButton />
    </div>
  )
}
