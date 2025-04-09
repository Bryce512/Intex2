import { useNavigate, useParams } from 'react-router-dom';
import HeaderHome from '../components/HeaderHome';
import MovieDetails from '../components/movieDetails';
import Footer from '../components/Footer';
import '../css/movieDetailsPage.css';

function MovieDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <HeaderHome />

      {!id ? (
        <div className="invalid-id-wrapper">
          <p className="invalid-id-message">Invalid movie ID</p>
        </div>
      ) : (
        <>
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <MovieDetails id={id} />
        </>
      )}

      <Footer />
    </>
  );
}

export default MovieDetailsPage;
