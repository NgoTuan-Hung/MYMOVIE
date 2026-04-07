import { Link } from "react-router-dom";
import { getPosterUrl } from "../../hooks/myMovieApi";
import "../../styles/movie-card.css";

export default function MovieCard({ movie }) {
    return (
        <Link to={`/movie/${movie.id}`} className="movie-card">
            <div className="movie-poster-container">
                {movie.posterUrl ? (
                    <img
                        src={getPosterUrl(movie.posterUrl)}
                        alt={movie.displayName}
                        className="movie-poster"
                        loading="lazy"
                    />
                ) : (
                    <div className="movie-poster-placeholder">
                        <span>🎬</span>
                    </div>
                )}
            </div>

            <div className="movie-info">
                <h3 className="movie-title">{movie.displayName}</h3>
                <div className="movie-meta">
                    <span className="meta-item">
                        {movie.releaseYear || "N/A"}
                    </span>
                    {movie.duration && (
                        <span className="meta-item">
                            {movie.duration} min
                        </span>
                    )}
                    {movie.episodeCount > 1 && (
                        <span className="meta-item">
                            {movie.episodeCount} episodes
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}