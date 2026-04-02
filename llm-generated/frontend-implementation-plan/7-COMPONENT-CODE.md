# Component Implementation Code

## Overview

This document contains the ACTUAL code for all JSX components that need to be created. Copy and implement these files.

## 1. App.jsx (Update)

**File**: `frontend/src/App.jsx`

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import HomePage from "./test/HomePage";
import MovieDetail from "./test/MovieDetail";
import MovieFilterPage from "./components/filter/MovieFilterPage";

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <NavigationBar />
        <main style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie" element={<MovieFilterPage defaultType="movie" />} />
            <Route path="/tv" element={<MovieFilterPage defaultType="series" />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

## 2. NavigationBar.jsx (Fix)

**File**: `frontend/src/components/NavigationBar.jsx`

```jsx
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import "../styles/navbar.css";

const navItems = [
    { label: "Home", path: "/" },
    { label: "Movies", path: "/movie" },
    { label: "TV Shows", path: "/tv" },
    { label: "Genres", path: "/genres" },
];

export default function NavigationBar() {
    const navigate = useNavigate();

    const handleSearch = (q) => {
        navigate(`/movie?search=${q}`);
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                🎬 MyMovie
            </Link>

            <SearchBar onSearch={handleSearch} />

            <div className="nav-links">
                {navItems.map((item) => (
                    <Link key={item.label} to={item.path} className="nav-link">
                        {item.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
```

## 3. MovieFilterPage.jsx (New)

**File**: `frontend/src/components/filter/MovieFilterPage.jsx`

```jsx
import { useMovieFilter } from "../../hooks/useMovieFilter";
import FilterControls from "./FilterControls";
import MovieGrid from "./MovieGrid";
import Pagination from "./Pagination";
import "../../styles/filter-page.css";

export default function MovieFilterPage({ defaultType = "movie" }) {
  const {
    filters,
    movies,
    loading,
    error,
    pagination,
    updateFilter,
    resetFilters,
    goToPage
  } = useMovieFilter(defaultType);

  const pageTitle = defaultType === "movie" ? "Movies" : "TV Shows";
  const emptyMessage = defaultType === "movie" 
    ? "No movies found matching your filters" 
    : "No TV shows found matching your filters";

  return (
    <div className="filter-page">
      <h1 className="page-title">{pageTitle}</h1>

      {/* Filter Controls */}
      <FilterControls
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        loading={loading}
      />

      {/* Loading State */}
      {loading && movies.length === 0 && (
        <div className="loading">Loading...</div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      )}

      {/* Movie Grid */}
      {!loading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} />
      )}

      {/* Empty State */}
      {!loading && !error && movies.length === 0 && (
        <div className="empty-state">
          <p>{emptyMessage}</p>
          <button onClick={resetFilters} className="reset-button">
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}
```

## 4. FilterControls.jsx (New)

**File**: `frontend/src/components/filter/FilterControls.jsx`

```jsx
import { FILTER_OPTIONS } from "../../test/myMovieApi";
import "../../styles/filter-controls.css";

export default function FilterControls({ filters, onFilterChange, onReset, loading }) {
  return (
    <div className="filter-controls">
      {/* Sort Dropdown */}
      <div className="filter-group">
        <label htmlFor="sort-select" className="filter-label">Sort By</label>
        <select
          id="sort-select"
          className="filter-select"
          value={filters.sort}
          onChange={(e) => onFilterChange("sort", e.target.value)}
        >
          <option value="">All</option>
          {FILTER_OPTIONS.sort.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Dropdown */}
      <div className="filter-group">
        <label htmlFor="category-select" className="filter-label">Category</label>
        <select
          id="category-select"
          className="filter-select"
          value={filters.category}
          onChange={(e) => onFilterChange("category", e.target.value)}
        >
          <option value="">All</option>
          {FILTER_OPTIONS.categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Country Dropdown */}
      <div className="filter-group">
        <label htmlFor="country-select" className="filter-label">Country</label>
        <select
          id="country-select"
          className="filter-select"
          value={filters.country}
          onChange={(e) => onFilterChange("country", e.target.value)}
        >
          <option value="">All</option>
          {FILTER_OPTIONS.countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* Release Year Dropdown */}
      <div className="filter-group">
        <label htmlFor="year-select" className="filter-label">Release Year</label>
        <select
          id="year-select"
          className="filter-select"
          value={filters.releaseYear}
          onChange={(e) => onFilterChange("releaseYear", e.target.value)}
        >
          <option value="">All</option>
          {FILTER_OPTIONS.releaseYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      <button
        className="reset-button"
        onClick={onReset}
        disabled={loading}
      >
        Reset
      </button>
    </div>
  );
}
```

## 5. MovieGrid.jsx (New)

**File**: `frontend/src/components/filter/MovieGrid.jsx`

```jsx
import MovieCard from "./MovieCard";
import "../../styles/movie-grid.css";

export default function MovieGrid({ movies }) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
```

## 6. MovieCard.jsx (New)

**File**: `frontend/src/components/filter/MovieCard.jsx`

```jsx
import { Link } from "react-router-dom";
import { getPosterUrl } from "../../test/myMovieApi";
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
```

## 7. Pagination.jsx (New)

**File**: `frontend/src/components/filter/Pagination.jsx`

```jsx
import "../../styles/pagination.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  
  // Generate page numbers to display
  const startPage = Math.max(0, currentPage - 2);
  const endPage = Math.min(totalPages - 1, currentPage + 2);
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      {/* Previous Button */}
      <button
        className="page-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        ← Prev
      </button>

      {/* Page Numbers */}
      {startPage > 0 && (
        <>
          <button className="page-button" onClick={() => onPageChange(0)}>
            1
          </button>
          {startPage > 1 && <span className="page-ellipsis">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          className={`page-button ${page === currentPage ? "active" : ""}`}
          onClick={() => onPageChange(page)}
        >
          {page + 1}
        </button>
      ))}

      {endPage < totalPages - 1 && (
        <>
          {endPage < totalPages - 2 && <span className="page-ellipsis">...</span>}
          <button className="page-button" onClick={() => onPageChange(totalPages - 1)}>
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        className="page-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        Next →
      </button>
    </div>
  );
}
```

## 8. useMovieFilter Hook (New)

**File**: `frontend/src/hooks/useMovieFilter.js`

```javascript
import { useState, useEffect, useCallback } from 'react';
import { fetchMoviesByFilter } from '../test/myMovieApi';

// Used by BOTH /movie and /tv pages
// defaultType: "movie" for movies page, "series" for TV page
export const useMovieFilter = (defaultType = 'movie') => {
  const [filters, setFilters] = useState({
    sort: '',
    category: '',
    country: '',
    releaseYear: '',
    type: defaultType
  });
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    totalPages: 0,
    totalElements: 0
  });

  // Fetch movies from API
  const fetchMovies = useCallback(async (currentFilters, currentPage = 0) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchMoviesByFilter(currentFilters, currentPage, 10);
      
      setMovies(result.content || []);
      setPagination({
        page: result.number || 0,
        totalPages: result.totalPages || 0,
        totalElements: result.totalElements || 0
      });
    } catch (err) {
      setError(err.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when filters change
  useEffect(() => {
    fetchMovies(filters, 0);
  }, [filters, fetchMovies]);

  // Update a single filter
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Reset all filters to defaults
  const resetFilters = useCallback(() => {
    setFilters({
      sort: '',
      category: '',
      country: '',
      releaseYear: '',
      type: defaultType
    });
  }, [defaultType]);

  // Go to specific page
  const goToPage = useCallback((page) => {
    fetchMovies(filters, page);
  }, [filters, fetchMovies]);

  return {
    filters,
    movies,
    loading,
    error,
    pagination,
    updateFilter,
    resetFilters,
    goToPage
  };
};
```

## 9. myMovieApi.js (Extend)

**File**: `frontend/src/test/myMovieApi.js`

```javascript
const BASE_URL = "http://localhost:8080";
const MOVIE_URL = `${BASE_URL}/movie`;

// Existing exports
export { BASE_URL, MOVIE_URL };

export async function fetchMovies() {
    const res = await fetch(`${BASE_URL}/movie`);
    return res.json();
}

export async function fetchHotMovies(limit = 10) {
    const res = await fetch(`${BASE_URL}/movie/hot?limit=${limit}`);
    return res.json();
}

export function getPosterUrl(fileName) {
    return `${BASE_URL}/test/image/${fileName}`;
}

export function getMovieUrl() {
    return `${MOVIE_URL}`
}

// NEW: Filter function - used by BOTH /movie and /tv pages
export async function fetchMoviesByFilter(filters = {}, page = 0, limit = 10) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
    });

    // Add filter parameters only if they have values
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.category) params.append('category', filters.category);
    if (filters.country) params.append('country', filters.country);
    if (filters.releaseYear) params.append('releaseYear', filters.releaseYear);
    if (filters.type) params.append('type', filters.type);

    const res = await fetch(`${MOVIE_URL}/filter?${params.toString()}`);
    
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return res.json();
}

// Static filter options for dropdowns
export const FILTER_OPTIONS = {
    sort: [
        { value: 'name', label: 'Name (A-Z)' },
        { value: 'viewCount', label: 'Most Popular' }
    ],
    categories: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller'],
    countries: ['US', 'UK', 'Japan', 'South Korea', 'France', 'Germany', 'Canada'],
    releaseYears: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'],
    types: [
        { value: 'movie', label: 'Movies' },
        { value: 'series', label: 'TV Shows' }
    ]
};
```

## 10. CSS Files

### filter-page.css

**File**: `frontend/src/styles/filter-page.css`

```css
.filter-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 24px;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.error-container {
  text-align: center;
  padding: 40px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.error-message {
  color: #d32f2f;
  font-size: 16px;
  margin-bottom: 16px;
}

.retry-button,
.reset-button {
  padding: 10px 24px;
  background: #d32f2f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.retry-button:hover,
.reset-button:hover {
  background: #b71c1c;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-state p {
  font-size: 18px;
  margin-bottom: 16px;
}
```

### filter-controls.css

**File**: `frontend/src/styles/filter-controls.css`

```css
.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 160px;
  flex: 1;
}

.filter-label {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select {
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  background: #f5f5f5;
  color: #333;
  cursor: pointer;
}

.filter-select:hover {
  border-color: #d32f2f;
}

.filter-select:focus {
  outline: none;
  border-color: #d32f2f;
  box-shadow: 0 0 0 2px rgba(211, 47, 47, 0.1);
}

.reset-button {
  padding: 10px 24px;
  background: #666;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  height: fit-content;
}

.reset-button:hover {
  background: #444;
}

.reset-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Mobile */
@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    width: 100%;
    min-width: auto;
  }
  
  .reset-button {
    width: 100%;
  }
}
```

### movie-grid.css

**File**: `frontend/src/styles/movie-grid.css`

```css
.movie-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

/* Tablet */
@media (max-width: 1024px) {
  .movie-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Small tablet */
@media (max-width: 768px) {
  .movie-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile */
@media (max-width: 480px) {
  .movie-grid {
    grid-template-columns: 1fr;
  }
}
```

### movie-card.css

**File**: `frontend/src/styles/movie-card.css`

```css
.movie-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}

.movie-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.movie-poster-container {
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: #f5f5f5;
}

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-poster-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  background: #e0e0e0;
}

.movie-info {
  padding: 12px;
}

.movie-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.movie-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.meta-item {
  font-size: 12px;
  color: #666;
}

/* Mobile */
@media (max-width: 768px) {
  .movie-poster-container {
    height: 200px;
  }
}
```

### pagination.css

**File**: `frontend/src/styles/pagination.css`

```css
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 20px;
}

.page-button {
  padding: 8px 14px;
  border: 1px solid #e0e0e0;
  background: #fff;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.page-button:hover:not(:disabled) {
  background: #d32f2f;
  color: white;
  border-color: #d32f2f;
}

.page-button.active {
  background: #d32f2f;
  color: white;
  border-color: #d32f2f;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-ellipsis {
  padding: 8px 4px;
  color: #999;
}
```

## File Structure After Implementation

```
frontend/src/
├── App.jsx                          # Updated with new routes
├── components/
│   ├── NavigationBar.jsx            # Fixed handleSearch
│   └── filter/
│       ├── MovieFilterPage.jsx      # Main filter page
│       ├── FilterControls.jsx       # Filter dropdowns
│       ├── MovieGrid.jsx            # Grid layout
│       ├── MovieCard.jsx            # Movie card
│       └── Pagination.jsx           # Pagination
├── hooks/
│   └── useMovieFilter.js            # Filter hook
├── styles/
│   ├── filter-page.css              # Page styles
│   ├── filter-controls.css          # Filter controls
│   ├── movie-grid.css               # Grid styles
│   ├── movie-card.css               # Card styles
│   └── pagination.css               # Pagination styles
└── test/
    └── myMovieApi.js                # Extended with filter function