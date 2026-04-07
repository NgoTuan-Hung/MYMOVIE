import { useEffect, useState } from "react";
import MovieGrid from "../components/filter/MovieGrid";
import "../styles/filter-page.css";
import "../styles/movie-grid.css";
import { fetchHotMovies, fetchMovies } from "../hooks/myMovieApi";

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
        return <div className="loading">Loading movies...</div>;
    }

    return (
        <div className="filter-page">
            {/* Hot Movies Section */}
            {hotMovies.length > 0 && (
                <section style={{ marginBottom: "40px" }}>
                    <h2 className="page-title" style={{ color: "var(--accent)" }}>
                        🔥 Hot Movies
                    </h2>
                    <MovieGrid movies={hotMovies} />
                </section>
            )}

            {/* All Movies Section */}
            <section>
                <h2 className="page-title">
                    🎬 All Movies
                </h2>
                <MovieGrid movies={allMovies} />
            </section>
        </div>
    );
}