import React, { useEffect, useRef } from "react";
import {
  Hospital,
  Phone,
  Mail,
  MapPin,
  Clock,
  PhoneCall,
} from "lucide-react";

export default function Footer() {
  const footerRef = useRef(null);

  // Footer ki height content ke hisaab se badal sakti hai
  // (mobile pe columns stack ho jate hain, text wrap hota
  // hai, etc). Isliye actual rendered height measure karke
  // ek CSS variable (--footer-height) set kar rahe hain,
  // taaki dusre fixed elements (jaise floating AI button)
  // ise `calc(var(--footer-height) + gap)` se use karke
  // hamesha footer ke upar rahein, bina hardcoded pixel
  // values ke.
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--footer-height",
        `${el.offsetHeight}px`
      );
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(el);

    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <footer className="mc-footer" ref={footerRef}>
      <style>{`
        .mc-footer {
          --mc-ink: #0E2A38;
          --mc-surface: #123545;
          --mc-line: rgba(255, 255, 255, 0.10);
          --mc-accent: #35C1AE;
          --mc-body: #AFC6D1;
          --mc-head: #F1F7F9;

          background: var(--mc-ink);
          color: var(--mc-body);

          position: relative;
          width: 100%;
        }

        .mc-footer h2,
        .mc-footer h3,
        .mc-footer h4 {
          color: var(--mc-head);
        }

        .mc-brand {
          font-size: 1.35rem;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .mc-heading {
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.01em;
        }

        .mc-footer p,
        .mc-footer li,
        .mc-footer address {
          max-width: 46ch;
          line-height: 1.65;
        }

        /* Emergency band — the one loud element */
        .mc-emergency {
          background: var(--mc-surface);
          border-bottom: 1px solid var(--mc-line);
        }

        .mc-emergency-number {
          display: inline-block;
          font-size: clamp(1.9rem, 5vw, 2.6rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--mc-head);
          text-decoration: none;
          border-bottom: 2px solid var(--mc-accent);
          padding-bottom: 0.1em;
        }

        .mc-emergency-number:hover,
        .mc-emergency-number:focus-visible {
          color: var(--mc-accent);
        }

        .mc-pulse {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--mc-accent);
          box-shadow: 0 0 0 0 rgba(53, 193, 174, 0.55);
          animation: mc-pulse 2.4s ease-out infinite;
        }

        @keyframes mc-pulse {
          70%  { box-shadow: 0 0 0 10px rgba(53, 193, 174, 0); }
          100% { box-shadow: 0 0 0 0 rgba(53, 193, 174, 0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .mc-pulse { animation: none; }
        }

        /* Links */
        .mc-link {
          color: var(--mc-body);
          text-decoration: none;
          width: fit-content;
          transition: color 0.15s ease;
        }

        .mc-link:hover {
          color: var(--mc-head);
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-color: var(--mc-accent);
        }

        .mc-footer a:focus-visible {
          outline: 2px solid var(--mc-accent);
          outline-offset: 3px;
          border-radius: 2px;
        }

        .mc-icon { color: var(--mc-accent); flex-shrink: 0; }

        .mc-bottom { border-top: 1px solid var(--mc-line); }

        .mc-fine { font-size: 0.875rem; }
      `}</style>

      {/* Emergency */}
      <div className="mc-emergency">
        <div className="container py-4">
          <div className="row align-items-center g-3">
            <div className="col-lg-7">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="mc-pulse" aria-hidden="true" />
                <span className="mc-fine">
                  Emergency department open 24 hours, every day
                </span>
              </div>

              <a href="tel:+911800123456" className="mc-emergency-number">
                1800 123 456
              </a>
            </div>

            <div className="col-lg-5">
              <div className="d-flex flex-column gap-2 mc-fine">
                <div className="d-flex gap-2">
                  <PhoneCall size={18} className="mc-icon" />
                  <span>
                    Ambulance dispatch and triage answer on the same line.
                  </span>
                </div>

                <div className="d-flex gap-2">
                  <MapPin size={18} className="mc-icon" />
                  <a href="/contact" className="mc-link">
                    Directions to the emergency entrance (Gate 2)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container py-5">
        <div className="row g-4 g-lg-5">
          {/* About */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Hospital size={30} className="mc-icon" />
              <span className="mc-brand">MediCare</span>
            </div>

            <p>
              A 240-bed multi-speciality hospital in Mohali, caring for
              patients across Punjab since 2010. Emergency, surgery and
              diagnostics run on site, around the clock.
            </p>

            <p className="mb-0 mc-fine">
              NABH accredited · Cashless treatment with most major insurers
            </p>
          </div>

          {/* Quick links */}
          <div className="col-lg-2 col-md-6">
            <h4 className="mc-heading mb-3">Quick links</h4>

            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><a href="/" className="mc-link">Home</a></li>
              <li><a href="/about" className="mc-link">About</a></li>
              <li><a href="/departments" className="mc-link">Departments</a></li>
              <li><a href="/doctors" className="mc-link">Find a doctor</a></li>
              <li><a href="/contact" className="mc-link">Contact</a></li>
            </ul>
          </div>

          {/* Departments */}
          <div className="col-lg-3 col-md-6">
            <h4 className="mc-heading mb-3">Departments</h4>

            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><a href="/departments" className="mc-link">Emergency and trauma</a></li>
              <li><a href="/departments" className="mc-link">Cardiology</a></li>
              <li><a href="/departments" className="mc-link">Neurology</a></li>
              <li><a href="/departments" className="mc-link">Paediatrics</a></li>
              <li><a href="/departments" className="mc-link">Orthopaedics</a></li>
            </ul>
          </div>

          {/* Visit */}
          <div className="col-lg-3 col-md-6">
            <h4 className="mc-heading mb-3">Visit us</h4>

            <div className="d-flex flex-column gap-3">
              <div className="d-flex gap-2">
                <MapPin size={18} className="mc-icon" />
                <address className="mb-0">
                  Phase 8B, Industrial Area
                  <br />
                  Mohali, Punjab 160059
                </address>
              </div>

              <div className="d-flex gap-2">
                <Phone size={18} className="mc-icon" />
                <a href="tel:+919876543210" className="mc-link">
                  +91 98765 43210
                </a>
              </div>

              <div className="d-flex gap-2">
                <Mail size={18} className="mc-icon" />
                <a href="mailto:info@medicare.com" className="mc-link">
                  info@medicare.com
                </a>
              </div>

              <div className="d-flex gap-2">
                <Clock size={18} className="mc-icon" />
                <div>
                  <div>OPD 8:00 am – 8:00 pm</div>
                  <div className="mc-fine">Visiting hours 4:00 – 6:00 pm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mc-bottom">
        <div className="container py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mc-fine">
            <p className="mb-0">
              © {new Date().getFullYear()} MediCare Hospital
            </p>

            <div className="d-flex flex-wrap gap-3">
              <a href="/privacy" className="mc-link">Privacy</a>
              <a href="/patient-rights" className="mc-link">Patient rights</a>
              <a href="/accessibility" className="mc-link">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}