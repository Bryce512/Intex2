import { useState, useEffect } from 'react';
import '../css/footer.css';

export function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', showPrivacy);
  }, [showPrivacy]);

  return (
    <>
      <footer className="footer">
        <div className="container">
          <p>
            &copy; {new Date().getFullYear()} CineNiche. All rights reserved.
          </p>
          <div onClick={() => setShowPrivacy(true)} className="privacy-link">
            Privacy Policy
          </div>
        </div>
      </footer>

      {showPrivacy && (
        <div className="modal-overlay" onClick={() => setShowPrivacy(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowPrivacy(false)}>
              ✖
            </button>
            <div className="modal-body">
              <h2>Privacy Policy</h2>
              <p>
                <strong>Effective Date:</strong> 4/8/2025
              </p>

              <p>
                At CineNiche, your privacy is important to us. This Privacy
                Policy explains how we collect, use, disclose, and protect your
                information when you visit our website and use our streaming
                services.
              </p>
              <p>
                By accessing or using CineNiche, you agree to the terms of this
                Privacy Policy. If you do not agree, please do not use our
                services.
              </p>

              <h3>1. Information We Collect</h3>
              <p>
                We collect both personal and non-personal information in order
                to provide and improve our services.
              </p>
              <h4>a. Information You Provide</h4>
              <ul>
                <li>
                  <strong>Account Information:</strong> name, email, password,
                  payment info.
                </li>
                <li>
                  <strong>Profile Details:</strong> preferences, watchlists,
                  reviews.
                </li>
                <li>
                  <strong>Communication:</strong> customer support interactions,
                  survey responses.
                </li>
              </ul>
              <h4>b. Information Collected Automatically</h4>
              <ul>
                <li>
                  <strong>Device and Usage Data:</strong> IP, browser, pages
                  visited, etc.
                </li>
                <li>
                  <strong>Viewing Activity:</strong> watched content, duration,
                  ratings.
                </li>
                <li>
                  <strong>Cookies and Tracking:</strong> for personalization and
                  analytics.
                </li>
              </ul>

              <h3>2. How We Use Your Information</h3>
              <ul>
                <li>Provide access to content and features</li>
                <li>Process transactions and subscriptions</li>
                <li>Personalize recommendations</li>
                <li>Send updates, offers, and account notifications</li>
                <li>Improve services and detect technical issues</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h3>3. Sharing of Information</h3>
              <p>We do not sell your information. We may share with:</p>
              <ul>
                <li>
                  <strong>Service Providers</strong> (e.g. payments, hosting)
                </li>
                <li>
                  <strong>Legal Requirements</strong> if compelled by law
                </li>
                <li>
                  <strong>Business Transfers</strong> like mergers or
                  acquisitions
                </li>
              </ul>

              <h3>4. Data Security</h3>
              <p>
                We use reasonable safeguards but cannot guarantee absolute
                security.
              </p>

              <h3>5. Your Choices and Rights</h3>
              <ul>
                <li>Update your info in account settings</li>
                <li>Unsubscribe from emails</li>
                <li>Manage cookies via your browser</li>
                <li>Request data deletion at [Insert Contact Email]</li>
              </ul>

              <h3>6. Children’s Privacy</h3>
              <p>
                Not for users under 13. We do not knowingly collect their data.
              </p>

              <h3>7. International Data Transfers</h3>
              <p>Your data may be stored/processed in the U.S. or elsewhere.</p>

              <h3>8. Changes to This Policy</h3>
              <p>
                We may update this policy. Continued use after changes means
                acceptance.
              </p>

              <h3>9. Contact Us</h3>
              <p>
                CineNiche Privacy Team
                <br />
                Email: privacy@cineniche.com
                <br />
                Website: www.cineniche.com
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;
