# Search Functionality Implementation Plan

## Overview
This document details the changes needed to implement search-by-name functionality across the frontend and backend. The search bar in the navigation will navigate to the MovieFilterPage with the search query persisted in the URL as a `name` parameter.

---

## Architecture Summary

### Current Flow
1. `SearchBar.jsx` — form with input + submit button, calls `onSearch(query)` prop on submit
2. `NavigationBar.jsx` — provides `handleSearch` that navigates to `/movie?search=${q}`
3. `MovieFilterPage.jsx` — uses `useMovieFilter` hook to fetch and display movies
4. `useMovieFilter.js` — reads URL params, builds filter object, calls `fetchMoviesByFilter`
5. `myMovieApi.js` — `fetchMoviesByFilter` builds query params and calls `/movie/filter`
6. **Backend**: `MovieController.getMovieByFilter()` → `MovieFilterRequest` → `MovieSpecification.filter()` → returns paginated results

### Problem
- The `name` search parameter is not included in the filter state in `useMovieFilter.js`
- The `name` parameter is not sent to the backend API
- The backend does not support searching by name in `MovieFilterRequest`, `MovieSpecification`, or the controller
- URL parameter `name` will be lost when changing other filters on the filter page

---

## Changes Required

### 1. Backend: `MovieFilterRequest.java`
**File:** `src/main/java/com/example/mymovie/DTO/MovieFilterRequest.java`

**Change:** Add a `name` field for search-by-name functionality.

```java
package com.example.mymovie.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MovieFilterRequest {
    private String name;        // <-- NEW: search by movie name
    private String sort;
    private String category;
    private String country;
    private String releaseYear;
    private String type;
}
```

---

### 2. Backend: `MovieSpecification.java`
**File:** `src/main/java/com/example/mymovie/Specification/MovieSpecification.java`

**Change:** Add a predicate for name matching using `LIKE` with case-insensitive comparison.

Add this block inside the `filter` method (after the existing predicates, before `return predicates;`):

```java
if (request.getName() != null && !request.getName().isBlank()) {
    String namePattern = "%" + request.getName().toLowerCase() + "%";
    predicates = cb.and(predicates,
        cb.like(cb.lower(root.get("displayName")), namePattern));
}
```

**Full updated file:**
```java
package com.example.mymovie.Specification;

import org.springframework.data.jpa.domain.Specification;

import com.example.mymovie.DTO.MovieFilterRequest;
import com.example.mymovie.Entity.Movie;

public class MovieSpecification {
    public static Specification<Movie> filter(MovieFilterRequest request) {
        return (root, query, cb) -> {
            query.distinct(true);

            var predicates = cb.conjunction();

            // NEW: Search by name (case-insensitive LIKE)
            if (request.getName() != null && !request.getName().isBlank()) {
                String namePattern = "%" + request.getName().toLowerCase() + "%";
                predicates = cb.and(predicates,
                    cb.like(cb.lower(root.get("displayName")), namePattern));
            }

            if (request.getCategory() != null) {
                var join = root.join("categories");
                predicates = cb.and(predicates, cb.equal(join.get("name"), request.getCategory()));
            }

            if (request.getCountry() != null) {
                var join = root.join("countries");
                predicates = cb.and(predicates, cb.equal(join.get("name"), request.getCountry()));
            }

            if (request.getReleaseYear() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("releaseYear"), request.getReleaseYear()));
            }

            if (request.getType() != null) {
                if (request.getType().equals("movie")) {
                    predicates = cb.and(predicates, cb.lt(root.get("episodeCount"), 2));
                } else if (request.getType().equals("series")) {
                    predicates = cb.and(predicates, cb.gt(root.get("episodeCount"), 1));
                }
            }

            return predicates;
        };
    }
}
```

---

### 3. Backend: `MovieController.java`
**File:** `src/main/java/com/example/mymovie/Controller/MovieController.java`

**Change:** Accept the `name` request parameter and set it on the `MovieFilterRequest`.

Update the `getMovieByFilter` method signature to include `@RequestParam(required = false) String name`:

```java
@GetMapping("/filter")
public Page<MovieResponse> getMovieByFilter(
        @RequestParam(required = false) String name,          // <-- NEW
        @RequestParam(required = false) String sort,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String country,
        @RequestParam(required = false) String releaseYear,
        @RequestParam(required = false) String type,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int limit) {
    MovieFilterRequest req = new MovieFilterRequest();
    req.setName(name);                                        // <-- NEW
    req.setSort(sort);
    req.setCategory(category);
    req.setCountry(country);
    req.setReleaseYear(releaseYear);
    req.setType(type);

    return movieService.getMovieByFilter(req, page, limit);
}
```

---

### 4. Frontend: `NavigationBar.jsx`
**File:** `frontend/src/components/NavigationBar.jsx`

**Change:** Update `handleSearch` to navigate to `/movie` with `name` query parameter instead of `search`. Also ensure the `type` parameter is preserved if currently on a type-specific page.

**Current code:**
```js
const handleSearch = (q) => {
    navigate(`/movie?search=${q}`);
};
```

**Updated code:**
```js
const handleSearch = (q) => {
    navigate(`/movie?name=${encodeURIComponent(q)}`);
};
```

This is a minimal change. The `name` parameter will be picked up by `useMovieFilter` (after we add it there) and will persist across filter changes.

---

### 5. Frontend: `useMovieFilter.js`
**File:** `frontend/src/hooks/useMovieFilter.js`

**Changes:**
1. Add `name` to the initial filter state (read from URL)
2. Add `name` to the URL sync effect
3. Add `name` to the reset function
4. Ensure `name` persists when other filters change (this happens automatically since we use `useSearchParams` and update filters individually)

**Updated file:**
```js
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchMoviesByFilter } from '../test/myMovieApi';

export const useMovieFilter = () => {
    const [searchParams] = useSearchParams();

    // Initialize filters from URL parameters
    const [filters, setFilters] = useState({
        name: searchParams.get('name') || '',           // <-- NEW
        sort: searchParams.get('sort') || '',
        category: searchParams.get('category') || '',
        country: searchParams.get('country') || '',
        releaseYear: searchParams.get('releaseYear') || '',
        type: searchParams.get('type') || ''
    });

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 0,
        totalPages: 0,
        totalElements: 0
    });

    // Sync filters when URL search params change
    useEffect(() => {
        const name = searchParams.get('name') || '';            // <-- NEW
        const sort = searchParams.get('sort') || '';
        const category = searchParams.get('category') || '';
        const country = searchParams.get('country') || '';
        const releaseYear = searchParams.get('releaseYear') || '';
        const type = searchParams.get('type') || '';

        setFilters(prev => {
            if (
                prev.name !== name ||                               // <-- NEW
                prev.sort !== sort ||
                prev.category !== category ||
                prev.country !== country ||
                prev.releaseYear !== releaseYear ||
                prev.type !== type
            ) {
                return { name, sort, category, country, releaseYear, type };
            }
            return prev;
        });
    }, [searchParams.toString()]);

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
            name: '',                                       // <-- NEW
            sort: '',
            category: '',
            country: '',
            releaseYear: '',
            type: ''
        });
    }, []);

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

---

### 6. Frontend: `myMovieApi.js`
**File:** `frontend/src/test/myMovieApi.js`

**Change:** Add `name` parameter to the `fetchMoviesByFilter` function.

**Current code (lines 26-46):**
```js
export async function fetchMoviesByFilter(filters = {}, page = 0, limit = 10) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
    });

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
```

**Updated code:**
```js
export async function fetchMoviesByFilter(filters = {}, page = 0, limit = 10) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
    });

    if (filters.name) params.append('name', filters.name);          // <-- NEW
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
```

---

### 7. Frontend: `FilterControls.jsx` (Optional UI Enhancement)
**File:** `frontend/src/components/filter/FilterControls.jsx`

**Suggestion:** If you want to display the current search term in the filter UI, you can add a read-only display or input showing the `name` filter. This is optional and depends on your UI preferences.

If the `FilterControls` component has individual inputs for each filter, you may want to add a `name` input field so users can refine their search from the filter page too. This would look like:

```jsx
<input
    type="text"
    value={filters.name || ''}
    onChange={(e) => onFilterChange('name', e.target.value)}
    placeholder="Search by name..."
/>
```

---

## Summary of All Changes

| File | Change |
|------|--------|
| `MovieFilterRequest.java` | Add `private String name;` field |
| `MovieSpecification.java` | Add name LIKE predicate (case-insensitive) |
| `MovieController.java` | Add `@RequestParam String name` and set on request |
| `NavigationBar.jsx` | Change `search=` to `name=` in navigate URL |
| `useMovieFilter.js` | Add `name` to filter state, sync, and reset |
| `myMovieApi.js` | Add `name` param to API request |
| `FilterControls.jsx` | (Optional) Add name input field |

---

## How Name Persistence Works

1. User types "avatar" in search bar and clicks Search
2. `NavigationBar.handleSearch` navigates to `/movie?name=avatar`
3. `useMovieFilter` reads `name=avatar` from URL and sets it in filter state
4. `fetchMoviesByFilter` sends `name=avatar` to backend `/movie/filter?name=avatar`
5. User then changes category to "Action" → `updateFilter('category', 'Action')` is called
6. This triggers a re-fetch with `{ name: 'avatar', category: 'Action', ... }`
7. The `name` parameter stays in the filter state because `updateFilter` only changes the specified key
8. URL still shows `name=avatar&category=Action` (if you sync URL with filter state — see note below)

### Important Note on URL Sync
Currently, `useMovieFilter` reads from URL params but does **not** write back to the URL when filters change via `updateFilter`. If you want the URL to update when filters change (so bookmarks/sharing work), you would need to add URL synchronization. This can be done by adding a `useEffect` that updates `searchParams` when `filters` change:

```js
const [, setSearchParams] = useSearchParams();

useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
    });
    setSearchParams(params, { replace: true });
}, [filters, setSearchParams]);
```

This is **recommended** but not strictly required for the name persistence to work (since the filter state is maintained in React state regardless of URL).

---

## Testing Checklist

- [ ] Search for a movie name and verify results match
- [ ] Search then change category filter — verify name search is still applied
- [ ] Search then change country filter — verify name search is still applied
- [ ] Search then change sort — verify name search is still applied
- [ ] Reset filters — verify name is cleared
- [ ] Empty search — verify all movies are returned
- [ ] Special characters in search — verify proper encoding
- [ ] Pagination with search — verify name persists across pages