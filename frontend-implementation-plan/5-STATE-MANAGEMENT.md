# State Management Plan

## Overview

This document details the state management strategy for the TWO filter pages. Both pages use the same hook but with different default type values.

## State Structure

```javascript
// State for each filter page
{
  // Filter parameters
  filters: {
    sort: '',           // 'name' | 'viewCount'
    category: '',       // Category name
    country: '',        // Country name
    releaseYear: '',    // Year string
    type: ''            // 'movie' (for /movie page) | 'series' (for /tv page)
  },
  
  // Pagination state
  pagination: {
    page: 0,
    totalPages: 0,
    totalElements: 0
  },
  
  // Data state
  movies: [],           // Array of MovieResponse objects
  loading: false,
  error: null
}
```

## Two Filter Pages State

### Movies Page (`/movie`)
- **Hook usage**: `useMovieFilter("movie")`
- **Default type**: `type: "movie"`
- **Purpose**: Filter movies (episodeCount < 2)

### TV Shows Page (`/tv`)
- **Hook usage**: `useMovieFilter("series")`
- **Default type**: `type: "series"`
- **Purpose**: Filter TV shows (episodeCount > 1)

## Custom Hook Implementation

### useMovieFilter Hook

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

## State Flow

```
User visits /movie or /tv
         ↓
MovieFilterPage receives defaultType prop
         ↓
useMovieFilter(defaultType) initializes state
         ↓
API call to /movie/filter with type filter
         ↓
Results displayed in MovieGrid
         ↓
User changes filter → updateFilter() → state update → API call
         ↓
User clicks page → goToPage() → API call with new page
```

## Filter Options

Use static options from `FILTER_OPTIONS` in `myMovieApi.js`:

```javascript
import { FILTER_OPTIONS } from '../test/myMovieApi';

// In FilterControls component
const sortOptions = FILTER_OPTIONS.sort;
const categoryOptions = FILTER_OPTIONS.categories;
const countryOptions = FILTER_OPTIONS.countries;
const yearOptions = FILTER_OPTIONS.releaseYears;
```

## Error Handling

Simple error display in the component:

```jsx
// In MovieFilterPage.jsx
if (error) {
  return (
    <div className="error-container">
      <p>Failed to load data: {error}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
}
```

## Loading States

```jsx
// In MovieFilterPage.jsx
if (loading && movies.length === 0) {
  return <div className="loading">Loading...</div>;
}
```

## Next Steps

Proceed to [6-TESTING-DEPLOYMENT.md](./6-TESTING-DEPLOYMENT.md) for simple testing instructions.
