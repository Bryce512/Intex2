import { useNavigate, useParams } from 'react-router-dom';
import HeaderHome from '../components/HeaderHome';
import MovieDetails from '../components/movieDetails';
import Footer from '../components/Footer';

function MovieDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Invalid movie ID</div>;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          cursor: 'pointer',
        }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </div>
      <HeaderHome />
      <MovieDetails id={id} />
      <Footer />
    </>
  );
}

export default MovieDetailsPage;
