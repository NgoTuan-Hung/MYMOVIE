import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPosterUrl, MOVIE_URL } from "./myMovieApi";
import { useNavigate } from "react-router-dom";

export default function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${MOVIE_URL}/${id}`)
            .then(res => res.json())
            .then(setMovie);
    }, [id]);

    if (!movie) return <div>Loading...</div>;

    return (
        <div style={{ padding: "40px" }}>

            {/* Top section */}
            <div style={{ display: "flex", gap: "30px" }}>

                {/* LEFT: Poster */}
                <div>
                    <img
                        src={getPosterUrl(movie.posterUrl)}
                        alt={movie.displayName}
                        style={{
                            width: "300px",
                            height: "450px",
                            objectFit: "cover",
                            borderRadius: "8px"
                        }}
                    />
                </div>

                {/* RIGHT: Info */}
                <div style={{ flex: 1 }}>
                    <h1>{movie.displayName}</h1>

                    <p><strong>Year:</strong> {movie.releaseYear}</p>
                    <p><strong>Duration:</strong> {movie.duration} min</p>
                    <p><strong>Status:</strong> {movie.status}</p>
                    <p><strong>Episodes:</strong> {movie.episodeCount}</p>

                    <p><strong>Actors:</strong> {movie.actors?.join(", ")}</p>
                    <p><strong>Directors:</strong> {movie.directors?.join(", ")}</p>
                    <p><strong>Categories:</strong> {movie.categories?.join(", ")}</p>
                    <p><strong>Countries:</strong> {movie.countries?.join(", ")}</p>
                    <p><strong>Languages:</strong> {movie.languages?.join(", ")}</p>
                </div>

                <div style={{ marginTop: "30px" }}>
                    <button
                        onClick={() => navigate(`/movie/${id}/watch`)}
                        className="watch-button"
                    >
                        ▶ WATCH NOW
                    </button>
                </div>
            </div>

            {/* Bottom section */}
            <div style={{ marginTop: "40px" }}>
                <h2>Description</h2>
                <p>
                    This is a placeholder description. Later you can extend your backend
                    to include a "description" field in DetailMovieResponse.
                </p>
            </div>

        </div>
    );
}