import React from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page">
      <div className="privacy-policy-container">
        <h1>Privacy Policy</h1>

        <p className="privacy-updated">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            We take your privacy seriously. This Privacy Policy explains how
            we collect, use, store, and protect your information when you use
            our website and hospital services.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <ul>
            <li>
              Name, phone number, email address, and other contact details
              when you book an appointment or submit a form.
            </li>
            <li>
              Health-related information that you voluntarily provide to our
              AI Health Assistant or hospital services.
            </li>
            <li>
              Device and browser information, including information collected
              through cookies and similar technologies.
            </li>
            <li>
              Website usage information, such as pages visited, time spent on
              pages, and general website interaction.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Use of Cookies</h2>
          <p>
            We use cookies and similar technologies to improve the website,
            remember your preferences, and understand website usage and
            analytics. You may accept or reject cookies through your browser
            settings where applicable. Rejecting certain cookies may affect
            some personalized features, but basic website functionality will
            generally remain available.
          </p>
        </section>

        <section>
          <h2>4. How We Use Your Information</h2>
          <ul>
            <li>
              To book, process, manage, and confirm appointments.
            </li>
            <li>
              To provide relevant general health information through the AI
              Health Assistant.
            </li>
            <li>
              To communicate with you regarding hospital services,
              appointments, and important updates.
            </li>
            <li>
              To improve website performance, functionality, and user
              experience.
            </li>
            <li>
              To maintain the security and proper operation of our services.
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Protection of Your Information</h2>
          <p>
            We use reasonable and standard security measures to help protect
            your personal and health-related information from unauthorized
            access, misuse, alteration, or disclosure. However, no online
            system or method of electronic transmission can be guaranteed to
            be completely secure. Therefore, we cannot guarantee absolute
            security of your information.
          </p>
        </section>

        <section>
          <h2>6. Sharing of Information with Third Parties</h2>
          <p>
            We do not sell your personal or health-related information to
            third-party advertisers. Your information may be shared with
            authorized hospital doctors, medical professionals, or staff when
            necessary to provide healthcare services, manage appointments, or
            support your treatment. Information may also be disclosed when
            required by applicable law, regulation, legal process, or
            government authority.
          </p>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your
            personal information, subject to applicable laws and legitimate
            operational or legal requirements. You may also contact us if you
            have concerns about how your information is being used.
          </p>
        </section>

        <section>
          <h2>8. Medical Disclaimer</h2>
          <p>
            Information provided by the AI Health Assistant is intended for
            general informational purposes only and should not be considered
            a diagnosis, prescription, or substitute for professional medical
            advice. For diagnosis, treatment, medication decisions, or
            emergency medical conditions, please consult a qualified
            healthcare professional.
          </p>
        </section>

        <section>
          <h2>9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our services, practices, or applicable requirements.
            Any changes will be published on this page, and the updated date
            will be displayed at the top of the policy.
          </p>
        </section>

        <section>
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding this
            Privacy Policy, please contact us through the following details:
            <br />
            📧 Email: support@yourhospital.com
            <br />
            📞 Phone: +91-XXXXXXXXXX
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;