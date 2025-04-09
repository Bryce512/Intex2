import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import RegisterModal from '../components/RegisterModal';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../api/moviesAPI';
import HorizontalCarousel from '../components/HorizontalCarousel';

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
    <Form onSubmit={handleSubmit}>
      <FloatingLabel
        controlId="floatingInput"
        label="Username"
        className="mb-3"
      >
        <Form.Control
          type="text"
          placeholder="email"
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
      <br />
      <button type="submit" className="btn btn-primary" disabled={loading}>
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

  const [publicCarousels, setPublicCarousels] = useState<{
    [category: string]: { title: string; showId: string }[];
  }>({});

  useEffect(() => {
    const fetchPublicCarousels = async () => {
      const endpoints = [
        {
          key: 'Top Rated',
          url: 'https://localhost:5000/Movies/TopRatedMovies',
        },
        {
          key: 'Trending Now',
          url: 'https://localhost:5000/Movies/PopularMovies',
        },
      ];

      const results: {
        [category: string]: { title: string; showId: string }[];
      } = {};

      for (const { key, url } of endpoints) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            results[key] = data;
          } else {
            console.error(`Failed to fetch movies for ${key}`);
          }
        } catch (error) {
          console.error(`Error fetching ${key}:`, error);
        }
      }

      setPublicCarousels(results);
    };

    fetchPublicCarousels();
  }, []);

  const getMovieItems = (movies: { title: string; showId: string }[]) => {
    return movies.map((movie) => ({
      id: movie.showId,
      imageUrl: `images/Movie Posters/${movie.title}.jpg`,
      linkUrl: `/show/${movie.showId}`,
    }));
  };

  return (
    <>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-12">
            <h2>Login</h2>

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
            <br />
            <p>
              Don't have an account?{' '}
              <a className="btn btn-link" onClick={() => setModalShow(true)}>
                Sign Up
              </a>
            </p>

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

        {/* Public Carousels */}
        <div className="mt-5">
          <h2 className="mb-3 text-center">
            You could be watching all these--Right now
          </h2>
          {Object.entries(publicCarousels).map(([category, movies]) => (
            <HorizontalCarousel
              key={category}
              title={category}
              items={getMovieItems(movies)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Login;
