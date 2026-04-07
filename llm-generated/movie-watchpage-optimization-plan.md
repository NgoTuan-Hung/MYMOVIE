# MovieWatchPage Optimization Plan - Cache Movie Data from MovieDetail

## Problem Statement

Currently, when navigating from `MovieDetail` to `MovieWatchPage`, the movie data is fetched twice:
1. First fetch in `MovieDetail.jsx` when the page loads
2. Second fetch in `MovieWatchPage.jsx` when the watch button is clicked

This creates unnecessary network requests and a brief loading state in MovieWatchPage even though we already have the data.

## Solution Overview

Use React Router's `navigate()` state parameter to pass the already-fetched movie data from `MovieDetail` to `MovieWatchPage`. The watch page will:
1. First check if movie data was passed via navigation state
2. Only fetch from API if no data was passed (direct URL access, bookmarks, etc.)

## Files to Modify

1. `frontend/src/test/MovieDetail.jsx` - Pass movie data in navigation state
2. `frontend/src/pages/MovieWatchPage.jsx` - Accept and use passed movie data

---

## Detailed Changes

### 1. MovieDetail.jsx Changes

**Current code:**
```jsx
<button
    onClick={() => navigate(`/movie/${id}/watch`)}
    className="watch-button"
>
    ▶ WATCH NOW
</button>
```

**Updated code:**
```jsx
<button
    onClick={() => navigate(`/movie/${id}/watch`, { state: { movie } })}
    className="watch-button"
>
    ▶ WATCH NOW
</button>
```

**Explanation:** 
The `navigate` function from react-router-dom accepts a second parameter `state` which allows passing data to the destination route. This data is accessible via `useLocation().state` in the target component.

---

### 2. MovieWatchPage.jsx Changes

**Current useEffect:**
```jsx
useEffect(() => {
    const fetchData = async () => {
        try {
            const movieRes = await fetch(`${MOVIE_URL}/${id}`);
            const movieData = await movieRes.json();
            setMovie(movieData);

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
```

**Updated useEffect:**
```jsx
const location = useLocation();
const passedMovie = location.state?.movie;

useEffect(() => {
    const fetchData = async () => {
        try {
            // If movie was passed from MovieDetail, use it directly
            if (passedMovie) {
                setMovie(passedMovie);
                const mockFiles = generateMockFiles(passedMovie);
                setFiles(mockFiles);
                setLoading(false);
            } else {
                // Otherwise, fetch from API (direct URL access, etc.)
                const movieRes = await fetch(`${MOVIE_URL}/${id}`);
                const movieData = await movieRes.json();
                setMovie(movieData);
                const mockFiles = generateMockFiles(movieData);
                setFiles(mockFiles);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching movie data:", error);
            setLoading(false);
        }
    };
    fetchData();
}, [id, passedMovie]);
```

**Explanation:**
- Import `useLocation` from react-router-dom
- Check if `location.state?.movie` exists (data passed from MovieDetail)
- If it exists, use it directly without API call
- If it doesn't exist (user typed URL directly, came from bookmark, etc.), fall back to fetching

---

## Complete Updated Files

### Updated MovieDetail.jsx

```jsx
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
                        onClick={() => navigate(`/movie/${id}/watch`, { state: { movie } })}
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
```

### Updated MovieWatchPage.jsx

```jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MOVIE_URL } from "../test/myMovieApi";
import VideoPlayer from "../components/player/VideoPlayer";
import "../styles/watch-page.css";

export default function MovieWatchPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const passedMovie = location.state?.movie;
    const [movie, setMovie] = useState(null);
    const [files, setFiles] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch movie details and files (only if not passed from navigation state)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // If movie was passed from MovieDetail, use it directly
                if (passedMovie) {
                    setMovie(passedMovie);
                    const mockFiles = generateMockFiles(passedMovie);
                    setFiles(mockFiles);
                    setLoading(false);
                } else {
                    // Otherwise, fetch from API (direct URL access, etc.)
                    const movieRes = await fetch(`${MOVIE_URL}/${id}`);
                    const movieData = await movieRes.json();
                    setMovie(movieData);
                    const mockFiles = generateMockFiles(movieData);
                    setFiles(mockFiles);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching movie data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id, passedMovie]);

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
```

---

## Benefits

1. **Reduced API Calls**: Eliminates one unnecessary API call when navigating from MovieDetail
2. **Faster Page Load**: MovieWatchPage loads instantly without loading state when coming from MovieDetail
3. **Backward Compatible**: Still works when accessing MovieWatchPage directly via URL or from other sources
4. **No External Dependencies**: Uses built-in React Router state passing, no need for additional state management libraries

## Considerations

1. **State Loss on Refresh**: If the user refreshes MovieWatchPage, the navigation state is lost and it will fetch from API (this is expected and correct behavior)
2. **Data Consistency**: If the movie data changes on the server while the user is on MovieDetail, they might see slightly stale data on MovieWatchPage. This can be mitigated by adding a refresh mechanism if needed
3. **Large State Objects**: For very large movie objects, consider using a proper state management solution (Context, Zustand, etc.) instead of navigation state

## Future Improvements

1. Consider implementing a global movie cache using React Context or Zustand for more complex scenarios
2. Add a "refresh" button on MovieWatchPage to re-fetch data if needed
3. Implement cache invalidation strategy if data freshness is critical