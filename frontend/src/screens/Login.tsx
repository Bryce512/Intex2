import { useState } from 'react';
import RegisterModal from '../components/RegisterModal';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../api/moviesAPI';
import Footer from '../components/Footer';

// Login page component with perfectly refined floating labels
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(e, setErrorMessage, setLoading, email, password, navigate);
  };

  return (
    <>
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back
      </button>
      <div className="login-wrapper">
        <div className="login-card">
          <img src="/images/logo.jpeg" className="login-logo" alt="Logo" />

          {errorMessage && (
            <Alert
              variant="danger"
              onClose={() => setErrorMessage('')}
              dismissible
            >
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <div className="floating-label-group">
                <input
                  type="text"
                  id="email"
                  className="form-input"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="email" className="floating-label">
                  Email
                </label>
              </div>
            </div>

            <div className="form-group">
              <div className="floating-label-group">
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="password" className="floating-label">
                  Password
                </label>
              </div>
            </div>

            <button
              type="submit"
              style={{
                background: 'linear-gradient(to right, #0077ff, #0055cc)',
                color: '#ffffff',
              }}
              className={`login-button ${loading ? 'disabled' : ''}`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="signup-prompt">
            <span>Don't have an account? </span>
            <span className="signup-link" onClick={() => setModalShow(true)}>
              Sign Up
            </span>
          </div>

          {modalShow && (
            <RegisterModal
              show={modalShow}
              onHide={() => setModalShow(false)}
              validated={validated}
              setValidated={setValidated}
            />
          )}
        </div>
      </div>
      <Footer />

      {/* Scoped CSS that will override Bootstrap styles */}
      <style>{`
        /* Global styles */
        :global(body) {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Login page container */
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #011627;
          padding: 20px;
          box-sizing: border-box;
        }

        /* Login card */
        .login-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          width: 100%;
          max-width: 380px;
          padding: 36px 30px;
          box-sizing: border-box;
          text-align: center;
        }

        /* Logo styling */
        .login-logo {
          display: block;
          margin: 0 auto 24px;
          max-width: 220px;
          height: auto;
        }

        /* Form styling */
        .login-form {
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 16px;
          text-align: left;
        }

        /* Final refined floating label implementation */
        .floating-label-group {
          position: relative;
        }

        .form-input {
          display: block !important;
          width: 100% !important;
          height: 56px !important;
          padding: 12px 16px !important;
          padding-top: 28px !important; /* Even more top padding for better label clearance */
          border: 1px solid #e1e5e9 !important;
          border-radius: 8px !important;
          background-color: #f9fafb !important;
          font-size: 15px !important;
          color: #333 !important;
          transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
          box-sizing: border-box !important;
        }

        .form-input::placeholder {
          color: transparent !important; /* Hide the placeholder text */
        }

        .form-input:focus {
          border-color: #0077ff !important;
          box-shadow: 0 0 0 3px rgba(0, 119, 255, 0.15) !important;
          outline: none !important;
        }

        /* Much lighter floating label styles with consistent color */
        .floating-label {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 15px;
          color: #bdc3cf !important; /* Light gray that stays consistent */
          pointer-events: none;
          transition: 0.25s ease all;
          padding: 0 2px;
          margin: 0;
        }

        /* Make labels even smaller and move them higher when active */
        .form-input:focus ~ .floating-label,
        .form-input:not(:placeholder-shown) ~ .floating-label {
          top: 6px !important; /* Move even higher */
          transform: translateY(0) scale(0.7) !important; /* Shrink even more - 70% of original size */
          left: 12px;
          font-size: 10px !important; /* Even smaller font */
          color: #bdc3cf !important; /* Keep the same light gray color */
          background: transparent;
        }

        /* Button styling with enforced white text */
        .login-button {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(to right, #0077ff, #0055cc);
          color: #ffffff !important; /* Forced white text */
          font-size: 16px !important;
          font-weight: 600 !important;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px rgba(0, 119, 255, 0.2);
          margin-top: 10px;
        }

        /* Force white text on all button states */
        .login-button,
        .login-button:hover,
        .login-button:active,
        .login-button:focus {
          color: #ffffff !important;
        }

        .login-button:hover {
          background: linear-gradient(to right, #0066dd, #004cbb);
          transform: translateY(-1px);
          box-shadow: 0 6px 10px rgba(0, 119, 255, 0.25);
        }

        .login-button.disabled {
          background: #a4caff;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
          color: #ffffff !important;
        }

        /* Sign up link styling */
        .signup-prompt {
          margin-top: 20px;
          font-size: 14px;
          color: #555;
        }

        .signup-link {
          color: #0077ff;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          margin-left: 4px;
        }

        .signup-link:hover {
          text-decoration: underline;
        }
        .back-button {
          position: fixed;
          top: 20px; /* Change this value to move it closer to the top */
          left: calc(var(--side-padding, 20px));
          z-index: 1000;
          padding: 10px 18px;
          font-size: 16px;
          background-color: #1e2a38; /* subtle dark tone that blends with #011627 */
          color: #ffffff;
          border: 1px solid #3f5e74; /* thin border to define shape */
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); /* subtle shadow for elevation */
          transition: all 0.2s ease-in-out;
        }

        .back-button:hover {
          background-color: #3f5e74; /* on hover: brighter shade */
          color: #f5f5f5;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </>
  );
}

export default Login;
