# Fix: Navigation Between Movie and TV Pages Not Working

## Problem Description

When navigating from `/movie` to `/tv` (or vice versa) while already on one of those pages, the content does not update. The URL changes but the displayed movies/shows remain the same. However, navigating from a different page (e.g., home page) to either `/movie` or `/tv` works correctly.

## Root Cause Analysis

The issue is in `frontend/src/hooks/useMovieFilter.js`. The hook uses `useState` to initialize the `type` filter:

```javascript
const [filters, setFilters] = useState({
    sort: '',
    category: '',
    country: '',
    releaseYear: '',
    type: defaultType  // ← Only set on initial mount!
});
```

**The Problem:**
1. `useState` only uses the initial value **once** when the component first mounts
2. When navigating from `/movie` to `/tv`, React Router reuses the same `MovieFilterPage` component instance
3. Since the component doesn't unmount/remount, `useState` doesn't re-run with the new `defaultType` value
4. The `filters.type` remains as `"movie"` even though `defaultType` prop changed to `"series"`
5. No `useEffect` watches for `defaultType` changes, so the data never refetches

**Visual Flow:**
```
User on /movie → filters.type = "movie" → Shows movies
User clicks "TV Shows" → URL changes to /tv → defaultType = "series"
BUT filters.type still = "movie" (useState doesn't re-run)
Result: Still shows movies, even though URL says /tv
```

## Solution

Add a `useEffect` that watches for `defaultType` prop changes and updates the `filters.type` state accordingly. This will trigger the existing fetch effect since it depends on `filters`.

---

## Detailed Code Changes

### File to Modify: `frontend/src/hooks/useMovieFilter.js`

Add a new `useEffect` that syncs `filters.type` with the `defaultType` prop:

```javascript
// Sync type when defaultType prop changes (e.g., navigating between /movie and /tv)
useEffect(() => {
    setFilters(prev => {
        // Only update if type actually changed
        if (prev.type !== defaultType) {
            return {
                ...prev,
                type: defaultType
            };
        }
        return prev;
    });
}, [defaultType]);
```

**Why this works:**
1. When `defaultType` changes (from `"movie"` to `"series"` or vice versa), this effect runs
2. It updates `filters.type` to match the new `defaultType`
3. Since `filters` is a dependency of the existing fetch `useEffect`, changing `filters` triggers a refetch
4. The `fetchMovies` function receives the updated filters with the correct `type`

---

## Complete Updated File

### `frontend/src/hooks/useMovieFilter.js` (Full Updated File)

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

    // NEW: Sync type when defaultType prop changes (e.g., navigating between /movie and /tv)
    useEffect(() => {
        setFilters(prev => {
            // Only update if type actually changed
            if (prev.type !== defaultType) {
                return {
                    ...prev,
                    type: defaultType
                };
            }
            return prev;
        });
    }, [defaultType]);

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

---

## Alternative Solution (Using `key` prop)

An alternative approach is to force React to remount the component when the route changes by using a `key` prop in `App.jsx`:

### `frontend/src/App.jsx` (Alternative Fix)

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
            {/* Add key prop to force remount when route changes */}
            <Route path="/movie" element={<MovieFilterPage key="movie" defaultType="movie" />} />
            <Route path="/tv" element={<MovieFilterPage key="tv" defaultType="series" />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App;
```

**Why this works:** The `key` prop forces React to completely unmount and remount the component when the key changes, which resets all state including `useState` initial values.

**Comparison of approaches:**

| Approach | Pros | Cons |
|----------|------|------|
| **useEffect in hook** (Recommended) | Smoother UX, preserves component state, more React-idiomatic | Requires hook modification |
| **key prop in App.jsx** | Simpler change, no hook modification | Loses all component state on navigation, causes full re-render |

**Recommendation:** Use the `useEffect` approach in the hook as it's more robust and provides better UX.

---

## Summary of Changes

### Recommended Fix (useEffect in hook)

| File | Change | Lines |
|------|--------|-------|
| `frontend/src/hooks/useMovieFilter.js` | Add `useEffect` to sync `defaultType` prop with `filters.type` state | Add 10 lines after the `pagination` state declaration |

### Code Diff

```diff
------- SEARCH
    const [pagination, setPagination] = useState({
        page: 0,
        totalPages: 0,
        totalElements: 0
    });

    // Fetch movies from API
=======
    const [pagination, setPagination] = useState({
        page: 0,
        totalPages: 0,
        totalElements: 0
    });

    // Sync type when defaultType prop changes (e.g., navigating between /movie and /tv)
    useEffect(() => {
        setFilters(prev => {
            if (prev.type !== defaultType) {
                return {
                    ...prev,
                    type: defaultType
                };
            }
            return prev;
        });
    }, [defaultType]);

    // Fetch movies from API
+++++++ REPLACE
```

---

## Testing Steps

1. Start the frontend development server: `cd frontend && npm run dev`
2. Open the application in a browser
3. Navigate to `/movie` - verify movies are displayed
4. Click "TV Shows" in the navigation bar
5. **Expected Result**: URL changes to `/tv` and TV shows are displayed
6. Click "Movies" in the navigation bar
7. **Expected Result**: URL changes to `/movie` and movies are displayed
8. Repeat navigation between Movie and TV Shows multiple times
9. **Verify**: Each navigation correctly updates the content
10. Test filter functionality on both pages to ensure filters still work correctly
11. Test pagination on both pages
12. Test reset button on both pages

## Edge Cases Handled

1. **Rapid navigation**: The `setFilters` check `if (prev.type !== defaultType)` prevents unnecessary state updates
2. **Filter persistence**: When switching between movie/tv, other filters (sort, category, etc.) are preserved - only the type changes
3. **Reset functionality**: The `resetFilters` function already uses `defaultType`, so it correctly resets to the current page's type