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
  validated,
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

  const isRateLimited = failedAttempts >= 5;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    <form onSubmit={onSubmit} noValidate className="custom-register-form">
      {errorMessage && (
        <div className="custom-alert-danger">{errorMessage}</div>
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
        />
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
        />
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
        />
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
        />
      </div>

      <div className="form-group checkbox-group">
        <input
          id="agreeTerms"
          type="checkbox"
          required
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          disabled={isRateLimited || loading}
        />
        <label htmlFor="agreeTerms" className="checkbox-label">
          Agree to terms and conditions
        </label>
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
