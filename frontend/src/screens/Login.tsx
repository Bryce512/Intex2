import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import RegisterModal from '../components/RegisterModal';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../api/moviesAPI';
import '../css/login.css'; // add this stylesheet for the style upgrade
import Footer from '../components/Footer';

function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  loading,
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}) {
  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <FloatingLabel
        controlId="floatingUsername"
        label="Username"
        className="mb-3"
      >
        <Form.Control
          type="text"
          placeholder="Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingPassword" label="Password">
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </FloatingLabel>

      <button
        type="submit"
        className="btn btn-dark w-100 mt-4"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </Form>
  );
}

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [validated, setValidated] = useState(false);

  return (
    <>
      <div className="login-wrapper">
        <div className="login-card">
          <img
            src="/images/logo.jpeg"
            style={{
              maxWidth: '100%',
              height: 'auto',
              maxHeight: '150px', // Adjust this value as needed
              display: 'block',
              margin: '0 auto',
            }}
            alt="Logo"
          />

          {errorMessage && (
            <Alert
              variant="danger"
              onClose={() => setErrorMessage('')}
              dismissible
            >
              {errorMessage}
            </Alert>
          )}

          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={(e) => {
              e.preventDefault();
              handleLogin(
                e,
                setErrorMessage,
                setLoading,
                email,
                password,
                navigate
              );
            }}
            loading={loading}
          />

          <div className="text-center mt-3">
            <span>Don't have an account? </span>
            <a className="btn btn-link p-0" onClick={() => setModalShow(true)}>
              Sign Up
            </a>
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
    </>
  );
}

export default Login;
