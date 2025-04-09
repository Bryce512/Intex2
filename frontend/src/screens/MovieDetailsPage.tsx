import { useNavigate, useParams } from 'react-router-dom';
import HeaderHome from '../components/HeaderHome';
import MovieDetails from '../components/movieDetails';
import Footer from '../components/Footer';
import '../css/movieDetailsPage.css'; // 👈 we'll define CSS here

function MovieDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <HeaderHome />

      <div className="page-wrapper">
        {!id ? (
          <div className="invalid-id-message">Invalid movie ID</div>
        ) : (
          <>
            <div className="back-button" onClick={() => navigate(-1)}>
              ← Back
            </div>
            <MovieDetails id={id} />
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

export default MovieDetailsPage;
