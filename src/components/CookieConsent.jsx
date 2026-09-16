import React, { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import "./CookieConsent.css";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check whether the user has already made a choice before
    const consent = localStorage.getItem("cookie_consent");

    if (!consent) {
      // Small delay so the banner slides in smoothly after page load
      const timer = setTimeout(() => setShowBanner(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeWithAnimation = (callback) => {
    setIsClosing(true);
    setTimeout(() => {
      callback();
      setShowBanner(false);
      setIsClosing(false);
    }, 300);
  };

  const handleAccept = () => {
    closeWithAnimation(() => {
      localStorage.setItem("cookie_consent", "accepted");
      // Enable analytics/tracking scripts here (Google Analytics, FB Pixel, etc.)
      // Example: initGoogleAnalytics();
    });
  };

  const handleReject = () => {
    closeWithAnimation(() => {
      localStorage.setItem("cookie_consent", "rejected");
      // Keep tracking scripts disabled/skipped here
    });
  };

  if (!showBanner) return null;

  return (
    <div className={`cookie-consent-banner ${isClosing ? "closing" : ""}`}>
      <div className="cookie-consent-content">
        <div className="cookie-consent-icon">
          <Cookie size={22} />
        </div>

        <div className="cookie-consent-text-wrap">
          <p className="cookie-consent-title">We value your privacy</p>
          <p className="cookie-consent-text">
            We use cookies to enhance your browsing experience, provide
            personalised care recommendations, and analyse our traffic. By
            clicking "Accept", you consent to our use of cookies. Read our{" "}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>{" "}
            to learn more.
          </p>
        </div>

        <div className="cookie-consent-buttons">
          <button
            type="button"
            className="cookie-btn cookie-btn-reject"
            onClick={handleReject}
          >
            Reject
          </button>

          <button
            type="button"
            className="cookie-btn cookie-btn-accept"
            onClick={handleAccept}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;