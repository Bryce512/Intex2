import { useState } from 'react';
import { handleSubmit } from '../api/moviesAPI';

interface RegisterFormProps {
  validated: boolean;
  setValidated: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  errorMessage: string;
  failedAttempts: number;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFailedAttempts: React.Dispatch<React.SetStateAction<number>>;
  handleClose: () => void;
}

function RegisterForm({
  setValidated,
  loading,
  errorMessage,
  failedAttempts,
  setErrorMessage,
  setLoading,
  setFailedAttempts,
  handleClose,
}: RegisterFormProps) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const isRateLimited = failedAttempts >= 5;

  // Validate the form
  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Check required fields
    if (!name.trim()) errors.name = 'Name is required';
    if (!username.trim()) errors.username = 'Username is required';
    if (!email.trim()) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (!agreeTerms) errors.agreeTerms = 'You must agree to the terms';

    // Validate email format
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate the form before submission
    const isValid = validateForm();
    setValidated(true);

    if (!isValid) {
      setErrorMessage('Please correct the errors below.');
      return;
    }

    // Clear any previous error messages
    setErrorMessage('');

    handleSubmit(
      e,
      setValidated,
      isRateLimited,
      username,
      password,
      email,
      name,
      setErrorMessage,
      setLoading,
      setFailedAttempts,
      handleClose
    );
  };

  return (
    <form onSubmit={onSubmit} className="custom-register-form">
      {errorMessage && (
        <div
          className={
            errorMessage.includes('successful')
              ? 'custom-alert-danger custom-alert-success'
              : 'custom-alert-danger'
          }
        >
          {errorMessage}
        </div>
      )}
      {isRateLimited && (
        <div className="custom-alert-danger">
          Too many failed registration attempts. Please try again later.
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          required
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isRateLimited || loading}
          className={validationErrors.name ? 'is-invalid' : ''}
        />
        {validationErrors.name && (
          <div className="invalid-feedback">{validationErrors.name}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isRateLimited || loading}
          className={validationErrors.email ? 'is-invalid' : ''}
        />
        {validationErrors.email && (
          <div className="invalid-feedback">{validationErrors.email}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          required
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isRateLimited || loading}
          className={validationErrors.username ? 'is-invalid' : ''}
        />
        {validationErrors.username && (
          <div className="invalid-feedback">{validationErrors.username}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isRateLimited || loading}
          className={validationErrors.password ? 'is-invalid' : ''}
        />
        {validationErrors.password && (
          <div className="invalid-feedback">{validationErrors.password}</div>
        )}
      </div>

      <div className="form-group checkbox-group">
        <input
          id="agreeTerms"
          type="checkbox"
          required
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          disabled={isRateLimited || loading}
          className={validationErrors.agreeTerms ? 'is-invalid' : ''}
        />
        <label htmlFor="agreeTerms" className="checkbox-label">
          Agree to terms and conditions
        </label>
        {validationErrors.agreeTerms && (
          <div className="invalid-feedback">{validationErrors.agreeTerms}</div>
        )}
      </div>

      <button
        type="submit"
        disabled={isRateLimited || loading}
        className="primary-button"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}

export default RegisterForm;
