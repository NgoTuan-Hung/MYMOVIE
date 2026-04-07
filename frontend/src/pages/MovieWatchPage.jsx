import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MOVIE_URL, getMovieFiles } from "../hooks/myMovieApi";
import VideoPlayer from "../components/player/VideoPlayer";
import "../styles/watch-page.css";

export default function MovieWatchPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [files, setFiles] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();
    const passedMovie = location.state?.movie;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // If movie was passed from MovieDetail, use it directly
                if (passedMovie) {
                    setMovie(passedMovie);
                } else {
                    // Otherwise, fetch from API (direct URL access, etc.)
                    const movieRes = await fetch(`${MOVIE_URL}/${id}`);
                    if (!movieRes.ok) throw new Error("Failed to fetch movie");
                    const movieData = await movieRes.json();
                    setMovie(movieData);
                }

                // Fetch movie files from backend
                const movieFiles = await getMovieFiles(id);
                setFiles(movieFiles);

                // Set default provider if files exist
                if (movieFiles.length > 0) {
                    const allProviders = [...new Set(movieFiles.flatMap(f => f.sources.map(s => s.provider)))];
                    if (allProviders.length > 0) {
                        setSelectedProvider(allProviders[0]);
                    }
                }
            } catch (err) {
                console.error("Error fetching movie data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, passedMovie]);

    // Extract unique providers from files
    const providers = [...new Set(files.flatMap(f => f.sources.map(s => s.provider)))];

    // Load first episode when provider is selected
    useEffect(() => {
        if (selectedProvider && files.length > 0) {
            loadFirstEpisode();
        }
    }, [selectedProvider]);

    const loadFirstEpisode = () => {
        const file = files[0];
        const source = file.sources.find(s => s.provider === selectedProvider);
        if (source) {
            setCurrentVideoUrl(source.url);
        }
    };

    const loadEpisode = (fileIndex) => {
        const file = files[fileIndex];
        const source = file.sources.find(s => s.provider === selectedProvider);
        if (source) {
            setCurrentVideoUrl(source.url);
        }
    };

    if (loading) return <div className="watch-loading">Loading...</div>;
    if (error) return <div className="watch-error">Error: {error}</div>;
    if (!movie) return <div className="watch-error">Movie not found</div>;
    if (files.length === 0) return <div className="watch-error">No episodes available</div>;

    return (
        <div className="watch-page">
            {/* Back button */}
            <button onClick={() => navigate(`/movie/${id}`)} className="back-button">
                ← Back to Details
            </button>

            {/* Movie title */}
            <h1 className="watch-title">{movie.displayName}</h1>

            <div className="video-container">
                {currentVideoUrl ? (
                    <VideoPlayer
                        key={currentVideoUrl}
                        src={currentVideoUrl}
                        title={movie?.displayName || ""}
                    />
                ) : (
                    <div className="no-video-message">Select an episode to start watching</div>
                )}
            </div>

            {/* Provider & Episode Selection */}
            <div className="episode-selection">
                {providers.map(provider => (
                    <div key={provider} className="provider-section">
                        <h3 className="provider-label">{provider}</h3>
                        <div className="episode-buttons">
                            {files.map((file, index) => {
                                const hasSource = file.sources.some(s => s.provider === provider);
                                if (!hasSource) return null;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => loadEpisode(index)}
                                        className={`episode-button ${currentVideoUrl === file.sources.find(s => s.provider === provider)?.url
                                            ? "active"
                                            : ""
                                            }`}
                                    >
                                        {file.episode ? `EP ${file.episode}` : "Movie"}
                                        {file.title && ` - ${file.title}`}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}