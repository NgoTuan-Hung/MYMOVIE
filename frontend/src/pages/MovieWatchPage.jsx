import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MOVIE_URL } from "../test/myMovieApi";
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

    // Fetch movie details and files
    useEffect(() => {
        const fetchData = async () => {
            try {
                const movieRes = await fetch(`${MOVIE_URL}/${id}`);
                const movieData = await movieRes.json();
                setMovie(movieData);

                // TODO: Replace with actual endpoint when backend is ready
                // const filesRes = await fetch(`${MOVIE_URL}/${id}/files`);
                // const filesData = await filesRes.json();
                // For now, use mock data
                const mockFiles = generateMockFiles(movieData);
                setFiles(mockFiles);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching movie data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Extract unique providers from files
    const providers = [...new Set(files.flatMap(f => f.sources.map(s => s.provider)))];

    // Default to first provider on load
    useEffect(() => {
        if (providers.length > 0 && !selectedProvider) {
            setSelectedProvider(providers[0]);
        }
    }, [providers, selectedProvider]);

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
    if (!movie) return <div className="watch-error">Movie not found</div>;

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

// TODO: Remove when backend is ready
function generateMockFiles(movie) {
    const episodeCount = movie.episodeCount || 1;
    const files = [];
    for (let i = 1; i <= episodeCount; i++) {
        files.push({
            episode: i,
            title: `Episode ${i}`,
            sources: [
                { provider: "Provider 1", url: "https://pub-ba42193aff49498c847386e3958fe7aa.r2.dev/videos/Movie-1/output.m3u8" },
                { provider: "Provider 2", url: "https://pub-ba42193aff49498c847386e3958fe7aa.r2.dev/videos/Movie-1/output.m3u8" }
            ]
        });
    }
    return files;
}