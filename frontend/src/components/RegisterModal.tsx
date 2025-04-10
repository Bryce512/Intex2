import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import RegisterForm from './RegisterForm';
import '../css/RegisterModal.css';

interface RegisterModalProps {
  show: boolean;
  validated: boolean;
  setValidated: React.Dispatch<React.SetStateAction<boolean>>;
  onHide: () => void;
}

function RegisterModal({
  show,
  validated,
  setValidated,
  onHide,
}: RegisterModalProps) {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleClose = () => {
    setErrorMessage('');
    setLoading(false);
    onHide();
  };

  // Disable background scrolling while modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="custom-modal-overlay">
      <div className="custom-modal-container">
        <div className="custom-modal-header">
          <div className="header-text">
            <h4 className="custom-modal-subtitle">Create Your Account</h4>
            <h2 className="custom-modal-title">Sign Up</h2>
          </div>
          <button className="custom-modal-close" onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="custom-modal-body">
    
          <RegisterForm
            validated={validated}
            setValidated={setValidated}
            loading={loading}
            errorMessage={errorMessage}
            failedAttempts={failedAttempts}
            setErrorMessage={setErrorMessage}
            setLoading={setLoading}
            setFailedAttempts={setFailedAttempts}
            handleClose={handleClose}
          />
        </div>
        <div className="custom-modal-footer">
          <button
            onClick={handleClose}
            disabled={loading}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default RegisterModal;
