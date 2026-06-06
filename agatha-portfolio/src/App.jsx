import { useState, useEffect, useRef, useCallback } from 'react'
import { ARTWORKS, FILTERS } from './artworks'
import claspedHands from './assets/clasped-hands.jpg'
import gallopingHorse from './assets/galloping-horse.jpg'
import './App.css'

/* ── hooks ── */
function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [threshold])
  return scrolled
}

function useInView(opts = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.1, ...opts })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

/* ── FadeIn wrapper ── */
function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView()
  return (
    <div
      ref={ref}
      style={{
        opacity:   visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity .9s cubic-bezier(.25,.46,.45,.94) ${delay}s,
                     transform .9s cubic-bezier(.25,.46,.45,.94) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ── Nav ── */
function Nav({ scrolled, onNav }) {
  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <span className="nav-logo" onClick={() => onNav('home')}>Agatha Dalton</span>
      <ul className="nav-links">
        {['gallery', 'about', 'contact'].map(s => (
          <li key={s} onClick={() => onNav(s)}>
            {s[0].toUpperCase() + s.slice(1)}
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ── Hero ── */
function Hero({ onNav }) {
  return (
    <section className="hero" id="home">
      <div className="hero-text">
        <div className="hero-eyebrow">Charcoal · Figure · Drawing</div>
        <h1 className="hero-name">
          Agatha
          <em>Dalton</em>
        </h1>
        <p className="hero-desc">
          Figurative drawings in charcoal and chalk — exploring the human
          form through light, shadow, and the rawness of mark-making.
        </p>
        <button className="hero-cta" onClick={() => onNav('gallery')}>
          View Works <span>→</span>
        </button>
      </div>

      <div className="hero-visual">
        <div className="hero-counter">01</div>
        <img
          className="hero-img-main"
          src={gallopingHorse}
          alt="Galloping horse charcoal drawing"
        />
        <img
          className="hero-img-accent"
          src={claspedHands}
          alt="Clasped hands charcoal drawing"
        />
      </div>
    </section>
  )
}

/* ── Gallery item ── */
function GalleryItem({ artwork, onClick }) {
  return (
    <div className="masonry-item" onClick={() => onClick(artwork)}>
      <img src={artwork.src} alt={artwork.title} loading="lazy" />
      <div className="masonry-overlay">
        <div className="masonry-info">
          <h3>{artwork.title}</h3>
          <p>{artwork.medium} · {artwork.year}</p>
        </div>
      </div>
    </div>
  )
}

/* ── Gallery section ── */
function Gallery({ onOpen }) {
  const [active, setActive] = useState('all')
  const filtered = active === 'all'
    ? ARTWORKS
    : ARTWORKS.filter(a => a.cat === active)

  return (
    <section className="section" id="gallery">
      <FadeIn><div className="section-label">Selected Works</div></FadeIn>
      <FadeIn delay={0.1}>
        <div className="gallery-header">
          <h2 className="gallery-title">The Collection</h2>
          <ul className="filter-list">
            {FILTERS.map(f => (
              <li
                key={f.key}
                className={`filter-item${active === f.key ? ' active' : ''}`}
                onClick={() => setActive(f.key)}
              >
                {f.label}
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>
      <FadeIn delay={0.18}>
        <div className="masonry">
          {filtered.map(a => (
            <GalleryItem key={a.id} artwork={a} onClick={onOpen} />
          ))}
        </div>
      </FadeIn>
    </section>
  )
}

/* ── About section ── */
function About() {
  return (
    <section className="about-section" id="about">
      <FadeIn>
        <div className="about-img-wrap">
          <img
            src={ARTWORKS.find(a => a.id === 3).src}
            alt="Agatha Dalton artwork detail"
          />
        </div>
      </FadeIn>
      <FadeIn delay={0.15}>
        <div className="about-text">
          <div className="section-label" style={{ marginBottom: 28 }}>About</div>
          <h2>
            The figure as <em>subject,<br />the mark as truth</em>
          </h2>
          <p>
            Agatha Dalton is a figurative artist working primarily in charcoal
            and chalk. Her practice is rooted in life drawing — the sustained
            study of the human form in real time, in real space.
          </p>
          <p>
            Each piece is an act of seeing: slow, attentive, and unresolved.
            The roughness of charcoal suits her — it preserves doubt, records
            process, and refuses easy finish.
          </p>
          <div className="about-stats">
            {[
              { num: '10+', label: 'Works Shown' },
              { num: '3+', label: 'Years Drawing' },
              { num: '∞', label: 'Poses Studied' },
            ].map(s => (
              <div key={s.label}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  )
}

/* ── Contact section ── */
function Contact() {
  return (
    <section className="contact-section" id="contact">
      <FadeIn><h2>Get in touch</h2></FadeIn>
      <FadeIn delay={0.1}>
        <p>Available for commissions, collaborations, and exhibitions.</p>
      </FadeIn>
      <FadeIn delay={0.2}>
        <ul className="contact-links">
        <li><a href="https://www.instagram.com/aggiedaltonn/" target="_blank" rel="noreferrer">Instagram</a></li>
<li><a href="mailto:acc23021@uconn.edu">Email</a></li>
<li><a href="#">Press Kit</a></li>
        </ul>
      </FadeIn>
    </section>
  )
}

/* ── Lightbox ── */
function Lightbox({ artwork, onClose }) {
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="lightbox"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <button className="lightbox-close" onClick={onClose}>Close ✕</button>
      <img src={artwork.src} alt={artwork.title} />
      <div className="lightbox-caption">
        <h3>{artwork.title}</h3>
        <p>{artwork.medium} · {artwork.year}</p>
      </div>
    </div>
  )
}

/* ── App root ── */
export default function App() {
  const scrolled = useScrolled()
  const [lightboxArt, setLightboxArt] = useState(null)

  const scrollTo = useCallback(id => {
    if (id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' })
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      <Nav scrolled={scrolled} onNav={scrollTo} />
      <main>
        <Hero onNav={scrollTo} />
        <Gallery onOpen={setLightboxArt} />
        <About />
        <Contact />
      </main>
      <footer>
        <p>© 2025 Agatha Dalton. All rights reserved.</p>
        <div className="footer-logo">AD</div>
        <p>Figurative Drawing</p>
      </footer>
      {lightboxArt && (
        <Lightbox artwork={lightboxArt} onClose={() => setLightboxArt(null)} />
      )}
    </>
  )
}
