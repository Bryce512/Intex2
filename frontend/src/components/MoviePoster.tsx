type MoviePosterProps = {
  posterUrl: string;
  title: string;
};

function MoviePoster({ posterUrl, title }: MoviePosterProps) {
  return (
    <div
      style={{
        width: '180px',
        height: '240px',
        overflow: 'hidden',
        borderRadius: '6px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
      }}
    >
      <img
        src={posterUrl}
        alt={title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
}

export default MoviePoster;
