# State Management Plan

## Overview

This document details the state management strategy for the movie filter page. We'll use React's built-in state management with custom hooks to handle filter state, API data, and user interactions efficiently.

## State Architecture

### 1. State Structure

```javascript
// Global state structure for the filter page
const filterPageState = {
  // Filter parameters
  filters: {
    sort: '',           // 'name' | 'viewCount'
    category: '',       // Category name
    country: '',        // Country name
    releaseYear: '',    // Year string
    type: ''            // 'movie' | 'series' (from URL)
  },
  
  // Pagination state
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10
  },
  
  // Data state
  movies: [],           // Array of MovieResponse objects
  loading: false,
  error: null,
  
  // UI state
  filterOptions: {      // Dropdown options
    categories: [],
    countries: [],
    releaseYears: []
  },
  lastUpdated: null     // Timestamp for cache invalidation
};
```

### 2. State Management Strategy

#### Local State (useState)
- Filter parameters
- Current page
- Loading states
- Error states
- Movie data

#### URL State (React Router)
- Filter parameters in query string
- Page number
- Type parameter (movies/series)

#### Context State (useContext) - Optional
- Filter options (if shared across components)
- User preferences
- Theme settings

#### Custom Hooks
- `useMovieFilter` - Main filter logic and API integration
- `useFilterParams` - URL parameter management
- `useDebounce` - Debounced filter updates

## Custom Hooks Implementation

### 1. useMovieFilter Hook

**File**: `frontend/src/hooks/useMovieFilter.js`

```javascript
import { useState, useEffect, useCallback, useRef } from 'react';
import { movieApi } from '../services/movieApi';

export const useMovieFilter = (initialFilters = {}) => {
  // State
  const [filters, setFilters] = useState({
    sort: '',
    category: '',
    country: '',
    releaseYear: '',
    type: initialFilters.type || '',
    ...initialFilters
  });
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10
  });

  // Refs for cleanup and debouncing
  const abortControllerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Debounced fetch function
  const fetchMoviesDebounced = useCallback(
    debounce(async (currentFilters, currentPage = 0) => {
      setLoading(true);
      setError(null);
      
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const result = await movieApi.fetchMoviesByFilter(
          currentFilters, 
          currentPage, 
          pagination.pageSize
        );
        
        if (!controller.signal.aborted) {
          setMovies(result.content || []);
          setPagination(prev => ({
            ...prev,
            currentPage: result.number || 0,
            totalPages: result.totalPages || 0,
            totalElements: result.totalElements || 0
          }));
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
          setMovies([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300),
    [pagination.pageSize]
  );

  // Initial fetch and filter changes
  useEffect(() => {
    fetchMoviesDebounced(filters, 0);
  }, [filters, fetchMoviesDebounced]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Filter update functions
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      sort: '',
      category: '',
      country: '',
      releaseYear: '',
      type: filters.type // Keep type from URL
    });
  }, [filters.type]);

  const goToPage = useCallback((page) => {
    fetchMoviesDebounced(filters, page);
  }, [filters, fetchMoviesDebounced]);

  const applyFilters = useCallback(() => {
    fetchMoviesDebounced(filters, 0);
  }, [filters, fetchMoviesDebounced]);

  return {
    // State
    filters,
    movies,
    loading,
    error,
    pagination,
    
    // Actions
    updateFilter,
    resetFilters,
    goToPage,
    applyFilters
  };
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
```

### 2. useFilterParams Hook

**File**: `frontend/src/hooks/useFilterParams.js`

```javascript
import { useSearchParams } from 'react-router-dom';

export const useFilterParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getFilterFromUrl = useCallback(() => ({
    sort: searchParams.get('sort') || '',
    category: searchParams.get('category') || '',
    country: searchParams.get('country') || '',
    releaseYear: searchParams.get('releaseYear') || '',
    type: searchParams.get('type') || '',
    page: parseInt(searchParams.get('page') || '0', 10)
  }), [searchParams]);

  const updateUrlParams = useCallback((newFilters) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const updatePage = useCallback((page) => {
    const params = new URLSearchParams(searchParams);
    if (page > 0) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  return {
    getFilterFromUrl,
    updateUrlParams,
    updatePage
  };
};
```

### 3. useFilterOptions Hook

**File**: `frontend/src/hooks/useFilterOptions.js`

```javascript
import { useState, useEffect } from 'react';
import { movieApi } from '../services/movieApi';

export const useFilterOptions = () => {
  const [options, setOptions] = useState({
    categories: [],
    countries: [],
    releaseYears: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // For now, use static options or derive from existing data
        // In the future, this would call: const result = await movieApi.getFilterOptions();
        
        const staticOptions = {
          categories: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller'],
          countries: ['US', 'UK', 'Japan', 'South Korea', 'France', 'Germany', 'Canada'],
          releaseYears: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015']
        };
        
        setOptions(staticOptions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  return {
    options,
    loading,
    error
  };
};
```

## State Flow Diagram

```
URL Parameters
    ↓
useFilterParams Hook
    ↓
Initial Filters State
    ↓
useMovieFilter Hook
    ↓
API Call (debounced)
    ↓
Movies Data + Pagination
    ↓
UI Components (FilterControls, MovieGrid, Pagination)
    ↓
User Interactions
    ↓
Filter Updates → Debounced API Call
```

## Performance Optimization

### 1. Memoization

```javascript
import { useMemo, useCallback } from 'react';

// Memoize expensive calculations
const memoizedMovies = useMemo(() => {
  return movies.map(movie => ({
    ...movie,
    formattedDuration: formatDuration(movie.duration),
    formattedReleaseYear: formatYear(movie.releaseYear)
  }));
}, [movies]);

// Memoize callback functions
const handleFilterChange = useCallback((key, value) => {
  updateFilter(key, value);
  updateUrlParams({ ...filters, [key]: value });
}, [updateFilter, updateUrlParams, filters]);
```

### 2. Virtualization (for long lists)

```javascript
import { FixedSizeGrid as Grid } from 'react-window';

const VirtualizedMovieGrid = ({ movies }) => {
  return (
    <Grid
      columnCount={5}
      columnWidth={240}
      height={600}
      rowCount={Math.ceil(movies.length / 5)}
      rowHeight={340}
      width={1200}
    >
      {({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * 5 + columnIndex;
        const movie = movies[index];
        
        return movie ? (
          <div style={style}>
            <MovieCard movie={movie} />
          </div>
        ) : null;
      }}
    </Grid>
  );
};
```

### 3. Caching Strategy

```javascript
// Simple in-memory cache
const cache = new Map();

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutes
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};
```

## Error Handling and Recovery

### 1. Error Boundaries

```javascript
// ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Filter page error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong with the filter page.</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 2. Retry Logic

```javascript
const useRetryableFetch = (fetchFunction, maxRetries = 3) => {
  const [retryCount, setRetryCount] = useState(0);
  
  const fetchWithRetry = useCallback(async (...args) => {
    try {
      return await fetchFunction(...args);
    } catch (error) {
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        return fetchWithRetry(...args);
      }
      throw error;
    }
  }, [fetchFunction, retryCount, maxRetries]);

  return fetchWithRetry;
};
```

## State Persistence

### 1. Local Storage for User Preferences

```javascript
const useUserPreferences = () => {
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('filter_preferences');
    return saved ? JSON.parse(saved) : {
      defaultPageSize: 10,
      defaultSort: 'viewCount',
      showAdvancedFilters: false
    };
  });

  const updatePreferences = useCallback((newPrefs) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    localStorage.setItem('filter_preferences', JSON.stringify(updated));
  }, [preferences]);

  return { preferences, updatePreferences };
};
```

## Next Steps

Proceed to [6-TESTING-DEPLOYMENT.md](./6-TESTING-DEPLOYMENT.md) for detailed testing and deployment strategy.