import { useEffect, useState } from "react";
import { fetchMovies, getPosterUrl } from "./myMovieApi";
import { Link } from "react-router-dom";

export default function MovieList() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetchMovies().then(setMovies);
    }, []);

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px" }}>
            {movies.map(movie => (
                <Link
                    to={`/movie/${movie.id}`}
                    key={movie.id}
                    style={{ textDecoration: "none", color: "inherit" }}
                >
                    <div style={{ border: "1px solid #ccc", padding: "10px", cursor: "pointer" }}>

                        <img
                            src={getPosterUrl(movie.posterUrl)}
                            alt={movie.displayName}
                            style={{ width: "100%", height: "300px", objectFit: "cover" }}
                        />

                        <h3>{movie.displayName}</h3>
                        <p>{movie.releaseYear}</p>
                        <p>{movie.duration} min</p>

                    </div>
                </Link>
            ))}
        </div>
    );
}