import { useEffect, useState } from "react";
import { fetchMovies, fetchHotMovies, getPosterUrl } from "./myMovieApi";
import { Link } from "react-router-dom";

export default function HomePage() {
    const [hotMovies, setHotMovies] = useState([]);
    const [allMovies, setAllMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [hotData, allData] = await Promise.all([
                    fetchHotMovies(10),
                    fetchMovies()
                ]);
                setHotMovies(hotData);
                setAllMovies(allData);
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div style={{ textAlign: "center", padding: "50px" }}>Loading movies...</div>;
    }

    return (
        <div>
            {/* Hot Movies Section */}
            {hotMovies.length > 0 && (
                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", color: "#d32f2f" }}>
                        🔥 Hot Movies
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px" }}>
                        {hotMovies.map(movie => (
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
                                    <h3 style={{ fontSize: "16px", marginTop: "10px", marginBottom: "5px" }}>{movie.displayName}</h3>
                                    <p style={{ fontSize: "14px", color: "#666", margin: "0" }}>{movie.releaseYear}</p>
                                    <p style={{ fontSize: "14px", color: "#666", margin: "0" }}>{movie.duration} min</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* All Movies Section */}
            <div>
                <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
                    🎬 All Movies
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px" }}>
                    {allMovies.map(movie => (
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
                                <h3 style={{ fontSize: "16px", marginTop: "10px", marginBottom: "5px" }}>{movie.displayName}</h3>
                                <p style={{ fontSize: "14px", color: "#666", margin: "0" }}>{movie.releaseYear}</p>
                                <p style={{ fontSize: "14px", color: "#666", margin: "0" }}>{movie.duration} min</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}