# Frontend-Backend Integration Plan: Movie Watch Page

## Overview

This plan details the changes required to connect the `MovieWatchPage` frontend component with the backend API for fetching movie files and video sources. Currently, the watch page uses mock data (`generateMockFiles`) instead of real data from the backend.

---

## Current State Analysis

### Backend Structure

**Entities:**
- `MovieFile` - Represents a movie file/episode with:
  - `id` (Long)
  - `movie` (ManyToOne relationship)
  - `episode` (Integer) - episode number
  - `title` (String) - file title
  - `sources` (OneToMany to MovieSource)

- `MovieSource` - Represents a video source with:
  - `id` (Long)
  - `file` (ManyToOne relationship)
  - `url` (String) - video URL (HLS stream)
  - `provider` (String) - provider name

**Existing API Endpoints:**
- `GET /movie/{id}` - Returns `DetailMovieResponse` (already working)
- `GET /movie` - Returns list of all movies
- `GET /movie/hot` - Returns hot movies
- `GET /movie/filter` - Returns filtered movies

**Missing API Endpoint:**
- `GET /movie/{id}/files` - Returns movie files with sources (needed for watch page)

### Frontend Structure

**Current Implementation (`MovieWatchPage.jsx`):**
- Fetches movie details from `${MOVIE_URL}/${id}` (working)
- Uses `generateMockFiles()` to create fake episode data (needs removal)
- Expects files structure: `{ episode, title, sources: [{ provider, url }] }`

**Existing API Hook (`myMovieApi.js`):**
- `getMovieFiles(movieId)` function exists but endpoint returns 404

---

## Required Changes

### Phase 1: Backend Changes

#### 1.1 Create DTO for Movie Files Response

**File:** `src/main/java/com/example/mymovie/DTO/MovieFileResponse.java` (NEW)

```java
package com.example.mymovie.DTO;

import java.util.List;
import java.util.stream.Collectors;

import com.example.mymovie.Entity.MovieFile;
import com.example.mymovie.Entity.MovieSource;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MovieFileResponse {
    private Long id;
    private Integer episode;
    private String title;
    private List<SourceResponse> sources;

    // Inner class for source response
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SourceResponse {
        private Long id;
        private String url;
        private String provider;
    }

    // Constructor from entity
    public MovieFileResponse(MovieFile file) {
        this.id = file.getId();
        this.episode = file.getEpisode();
        this.title = file.getTitle();
        this.sources = file.getSources() != null 
            ? file.getSources().stream()
                .map(this::toSourceResponse)
                .collect(Collectors.toList())
            : List.of();
    }

    private SourceResponse toSourceResponse(MovieSource source) {
        return new SourceResponse(
            source.getId(),
            source.getUrl(),
            source.getProvider()
        );
    }
}
```

#### 1.2 Add Repository Method

**File:** `src/main/java/com/example/mymovie/Repository/MovieFileRepository.java` (MODIFY)

Add method to find files by movie ID:

```java
package com.example.mymovie.Repository;

import com.example.mymovie.Entity.MovieFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MovieFileRepository extends JpaRepository<MovieFile, Long> {
    long count();
    
    // New method to fetch files by movie ID with sources eagerly loaded
    @Query("SELECT DISTINCT f FROM MovieFile f LEFT JOIN FETCH f.sources WHERE f.movie.id = :movieId")
    List<MovieFile> findByMovieIdWithSources(@Param("movieId") Long movieId);
}
```

#### 1.3 Add Service Method

**File:** `src/main/java/com/example/mymovie/Service/MyMovieService.java` (MODIFY)

Add imports and new method:

```java
// Add these imports at the top:
import com.example.mymovie.DTO.MovieFileResponse;
import com.example.mymovie.Repository.MovieFileRepository;

// Add the repository field (update existing @RequiredArgsConstructor class):
private final MovieFileRepository movieFileRepository;

// Add new method:
public List<MovieFileResponse> getMovieFilesByMovieId(Long movieId) {
    List<MovieFile> files = movieFileRepository.findByMovieIdWithSources(movieId);
    return files.stream()
        .map(MovieFileResponse::new)
        .collect(Collectors.toList());
}
```

#### 1.4 Add Controller Endpoint

**File:** `src/main/java/com/example/mymovie/Controller/MovieController.java` (MODIFY)

Add imports and new endpoint:

```java
// Add import:
import com.example.mymovie.DTO.MovieFileResponse;

// Add new endpoint method:
@GetMapping("/{id}/files")
public List<MovieFileResponse> getMovieFiles(@PathVariable Long id) {
    return movieService.getMovieFilesByMovieId(id);
}
```

---

### Phase 2: Frontend Changes

#### 2.1 Update `MovieWatchPage.jsx`

**File:** `frontend/src/pages/MovieWatchPage.jsx` (MODIFY)

Key changes:
1. Import `getMovieFiles` from API hooks
2. Replace `generateMockFiles` calls with actual API call
3. Handle loading/error states for files
4. Remove the `generateMockFiles` function entirely

```jsx
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
```

#### 2.2 Verify `myMovieApi.js`

**File:** `frontend/src/hooks/myMovieApi.js` (NO CHANGES NEEDED)

The `getMovieFiles` function already exists and is correctly configured:

```javascript
export async function getMovieFiles(movieId) {
    const res = await fetch(`${MOVIE_URL}/${movieId}/files`);
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
}
```

---

## Data Flow Diagram

```
MovieWatchPage
     │
     ├──► GET /movie/{id}  ──────────────► Returns DetailMovieResponse
     │                                        (poster, title, actors, etc.)
     │
     └──► GET /movie/{id}/files  ────────► Returns List<MovieFileResponse>
                                              │
                                              ├── MovieFileResponse { id, episode, title, sources[] }
                                              │
                                              └── SourceResponse { id, url, provider }
```

---

## API Response Example

**GET /movie/1/files**

```json
[
  {
    "id": 1,
    "episode": 1,
    "title": "Pilot Episode",
    "sources": [
      {
        "id": 1,
        "url": "https://example.com/videos/movie1-ep1/output.m3u8",
        "provider": "Provider 1"
      },
      {
        "id": 2,
        "url": "https://cdn2.example.com/videos/movie1-ep1/output.m3u8",
        "provider": "Provider 2"
      }
    ]
  },
  {
    "id": 2,
    "episode": 2,
    "title": "Second Episode",
    "sources": [
      {
        "id": 3,
        "url": "https://example.com/videos/movie1-ep2/output.m3u8",
        "provider": "Provider 1"
      }
    ]
  }
]
```

---

## File Summary

### Files to Create (Backend)
| File | Purpose |
|------|---------|
| `src/main/java/com/example/mymovie/DTO/MovieFileResponse.java` | DTO for movie file with sources |

### Files to Modify (Backend)
| File | Changes |
|------|---------|
| `src/main/java/com/example/mymovie/Repository/MovieFileRepository.java` | Add `findByMovieIdWithSources` method |
| `src/main/java/com/example/mymovie/Service/MyMovieService.java` | Add `movieFileRepository` field and `getMovieFilesByMovieId` method |
| `src/main/java/com/example/mymovie/Controller/MovieController.java` | Add `GET /movie/{id}/files` endpoint |

### Files to Modify (Frontend)
| File | Changes |
|------|---------|
| `frontend/src/pages/MovieWatchPage.jsx` | Replace mock data with `getMovieFiles` API call, remove `generateMockFiles` function |

---

## Testing Checklist

- [ ] Backend: Test `GET /movie/{id}/files` returns correct data
- [ ] Backend: Verify sources are eagerly loaded (no N+1 query issue)
- [ ] Frontend: Watch page loads without errors
- [ ] Frontend: Episode buttons render correctly
- [ ] Frontend: Provider switching works
- [ ] Frontend: Video player loads correct URL
- [ ] Frontend: Error state displays when no files exist
- [ ] Frontend: Loading state displays during fetch

---

## Notes

1. The `MovieFileRepository` uses `DISTINCT` with `LEFT JOIN FETCH` to avoid duplicate results when a file has multiple sources.
2. The `MovieFileResponse` DTO uses an inner class `SourceResponse` to keep the response structure clean.
3. The frontend now handles the case where no files/episodes are available for a movie.
4. Error handling has been improved with a dedicated error state.