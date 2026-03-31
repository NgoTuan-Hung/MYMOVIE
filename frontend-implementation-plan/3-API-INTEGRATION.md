# API Integration Plan

## Overview

This document details the API integration strategy for connecting the frontend filter page to the existing backend endpoints. The integration will handle filter parameters, pagination, and data fetching.

## Backend API Analysis

### Current Filter Endpoint
```http
GET /movie/filter
```

**Query Parameters**:
- `sort`: String ("name" or "viewCount")
- `category`: String (category name)
- `country`: String (country name) - ⚠️ Currently @RequestBody, should be @RequestParam
- `releaseYear`: String (year)
- `type`: String ("movie" or "series")
- `page`: Integer (default: 0)
- `limit`: Integer (default: 10)

**Response Format**:
```json
{
  "content": [
    {
      "id": 1,
      "displayName": "Movie Name",
      "releaseYear": 2023,
      "duration": 120,
      "status": "ACTIVE",
      "episodeCount": 1,
      "posterUrl": "poster.jpg"
    }
  ],
  "totalElements": 100,
  "totalPages": 10,
  "size": 10,
  "number": 0
}
```

### Issues Identified
1. **Country Parameter**: Currently uses `@RequestBody` instead of `@RequestParam`
2. **Type Parameter**: Should be "movies" and "series" to match frontend routing
3. **Sort Parameter**: Should handle "name" and "viewCount" correctly

## Frontend API Integration

### 1. Enhanced API Utility Functions

**Note**: Extend the existing `myMovieApi.js` file instead of creating a new file.

**File**: `frontend/src/test/myMovieApi.js` (extend existing)

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

### 2. Custom Hook for Filter Logic

**File**: `frontend/src/hooks/useMovieFilter.js`

```javascript
import { useState, useEffect, useCallback } from 'react';
import { fetchMoviesByFilter } from '../test/myMovieApi';

// Hook for BOTH /movie and /tv pages
// defaultType: "movie" for /movie page, "series" for /tv page
export const useMovieFilter = (defaultType = 'movie') => {
  const [filters, setFilters] = useState({
    sort: '',
    category: '',
    country: '',
    releaseYear: '',
    type: defaultType  // Set from page route
  });
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    totalPages: 0,
    totalElements: 0
  });

  // Fetch movies with current filters
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
      type: defaultType // Reset to page default
    });
  }, [defaultType]);

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

### 3. URL Parameter Integration

**File**: `frontend/src/utils/urlParams.js`

```javascript
import { useSearchParams } from 'react-router-dom';

export const useFilterParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getFilterFromUrl = () => ({
    sort: searchParams.get('sort') || '',
    category: searchParams.get('category') || '',
    country: searchParams.get('country') || '',
    releaseYear: searchParams.get('releaseYear') || '',
    type: searchParams.get('type') || '',
    page: parseInt(searchParams.get('page') || '0', 10)
  });

  const updateUrlParams = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    setSearchParams(params);
  };

  return {
    getFilterFromUrl,
    updateUrlParams
  };
};
```

## Backend Fixes Required

### 1. Fix Country Parameter Issue

**File**: `src/main/java/com/example/mymovie/Controller/MovieController.java`

```java
@GetMapping("/filter")
public Page<MovieResponse> getMovieByFilter(
    @RequestParam(required = false) String sort,
    @RequestParam(required = false) String category, 
    @RequestParam(required = false) String country,  // Change from @RequestBody to @RequestParam
    @RequestParam(required = false) String releaseYear, 
    @RequestParam(required = false) String type,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int limit) {
    
    MovieFilterRequest req = new MovieFilterRequest();
    req.setSort(sort);
    req.setCategory(category);
    req.setCountry(country);
    req.setReleaseYear(releaseYear);
    req.setType(type);

    return movieService.getMovieByFilter(req, page, limit);
}
```

### 2. Add Filter Options Endpoint

**File**: `src/main/java/com/example/mymovie/Controller/MovieController.java`

```java
@GetMapping("/filter/options")
public ResponseEntity<Map<String, List<String>>> getFilterOptions() {
    Map<String, List<String>> options = new HashMap<>();
    
    // Get categories
    List<String> categories = movieRepository.findAllCategories();
    options.put("categories", categories);
    
    // Get countries
    List<String> countries = movieRepository.findAllCountries();
    options.put("countries", countries);
    
    // Get release years
    List<String> years = movieRepository.findAllReleaseYears();
    options.put("releaseYears", years);
    
    return ResponseEntity.ok(options);
}
```

## Error Handling Strategy

### 1. Network Errors
- Retry mechanism for failed requests
- User-friendly error messages
- Graceful degradation

### 2. Validation Errors
- Client-side validation before API calls
- Server-side validation feedback
- Clear error indicators

### 3. Loading States
- Skeleton loaders for movie grid
- Loading spinners for filter operations
- Progressive loading for pagination

## Performance Optimization

### 1. Request Optimization
- Debounced filter updates (300ms delay)
- Caching for filter options
- Efficient pagination

### 2. Response Optimization
- Only fetch necessary data
- Compress image URLs
- Handle large result sets efficiently

## Next Steps

Proceed to [4-STYLING-LAYOUT.md](./4-STYLING-LAYOUT.md) for detailed styling and layout implementation plan.