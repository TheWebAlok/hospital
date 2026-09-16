import React, { useState, useEffect } from "react";
import "./CookieConsent.css";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check kar rahe hain ki user pehle kabhi choice de chuka hai ya nahi
    const consent = localStorage.getItem("cookie_consent");

    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShowBanner(false);

    // Yahan aap analytics/tracking scripts (Google Analytics, FB Pixel, etc.) enable kar sakte ho
    // Example: initGoogleAnalytics();
  };

  const handleReject = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setShowBanner(false);

    // Yahan tracking scripts disable/skip rakhna
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-consent-banner">
      <div className="cookie-consent-content">
        <p className="cookie-consent-text">
          🍪 Hum aapke better experience ke liye cookies use karte hain. Site
          use karke aap hamari{" "}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>{" "}
          se sehmat hote hain.
        </p>

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
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;