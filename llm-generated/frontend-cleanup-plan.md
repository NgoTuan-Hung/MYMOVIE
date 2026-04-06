# Front-End Cleanup Plan

> Generated: 2026-04-06
> Scope: `App.jsx`, `MovieWatchPage.jsx`, `VideoPlayer.jsx`

---

## Summary

After reviewing the three files, I identified **6 issues** across them:
- **2 bugs** (unused callbacks that break functionality)
- **2 performance issues** (unnecessary re-renders)
- **2 code quality issues** (redundant code, missing error handling)

---

## Issue 1: BUG — `onProviderChange` is defined but never used in VideoPlayer.jsx

**File:** `frontend/src/components/player/VideoPlayer.jsx`
**Severity:** High — HLS provider configuration is never applied

### Problem
The `onProviderChange` function is defined (lines 33-53) but is never passed to the `<MediaPlayer>` component. This means:
- Custom `hlsConfig` is never applied
- HLS error event listeners are never registered

### Fix
Pass `onProviderChange` to `<MediaPlayer>`:

```jsx
// BEFORE (line ~100)
<MediaPlayer
    src={src}
    viewType='video'
    streamType='on-demand'
    logLevel='warn'
    crossOrigin
    playsInline
    title={title}
    poster={poster}
>

// AFTER
<MediaPlayer
    src={src}
    viewType='video'
    streamType='on-demand'
    logLevel='warn'
    crossOrigin
    playsInline
    title={title}
    poster={poster}
    onProviderChange={onProviderChange}
>
```

---

## Issue 2: BUG — `handleError` is defined but never used in VideoPlayer.jsx

**File:** `frontend/src/components/player/VideoPlayer.jsx`
**Severity:** High — Errors are silently swallowed

### Problem
The `handleError` function is defined (lines 56-61) but is never passed to `<MediaPlayer>`. The `onError` prop is accepted but never wired up.

### Fix
Pass `onError` to `<MediaPlayer>`:

```jsx
// AFTER (add to MediaPlayer props)
<MediaPlayer
    src={src}
    viewType='video'
    streamType='on-demand'
    logLevel='warn'
    crossOrigin
    playsInline
    title={title}
    poster={poster}
    onProviderChange={onProviderChange}
    onError={handleError}
>
```

---

## Issue 3: PERFORMANCE — `providers` recalculated on every render in MovieWatchPage.jsx

**File:** `frontend/src/pages/MovieWatchPage.jsx`
**Severity:** Medium — Unnecessary computation on each render

### Problem
Line 37: `const providers = [...new Set(files.flatMap(f => f.sources.map(s => s.provider)))];`
This runs on every render even when `files` hasn't changed.

### Fix
Use `useMemo`:

```jsx
// BEFORE (line 37)
const providers = [...new Set(files.flatMap(f => f.sources.map(s => s.provider)))];

// AFTER
const providers = useMemo(() => {
    return [...new Set(files.flatMap(f => f.sources.map(s => s.provider)))];
}, [files]);
```

Also add `useMemo` to the import:
```jsx
import { useEffect, useState, useMemo, useCallback } from "react";
```

---

## Issue 4: PERFORMANCE — `loadEpisode` and `loadFirstEpisode` recreated on every render

**File:** `frontend/src/pages/MovieWatchPage.jsx`
**Severity:** Medium — Causes unnecessary re-renders of child components

### Problem
Lines 48-60: These functions are plain function declarations, recreated on every render. They are used in `useEffect` dependencies and as event handlers.

### Fix
Wrap with `useCallback`:

```jsx
// BEFORE (lines 48-60)
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

// AFTER
const loadFirstEpisode = useCallback(() => {
    if (files.length === 0) return;
    const file = files[0];
    const source = file.sources.find(s => s.provider === selectedProvider);
    if (source) {
        setCurrentVideoUrl(source.url);
    }
}, [files, selectedProvider]);

const loadEpisode = useCallback((fileIndex) => {
    const file = files[fileIndex];
    const source = file.sources.find(s => s.provider === selectedProvider);
    if (source) {
        setCurrentVideoUrl(source.url);
    }
}, [files, selectedProvider]);
```

---

## Issue 5: CODE QUALITY — Redundant `!src` check in VideoPlayer.jsx

**File:** `frontend/src/components/player/VideoPlayer.jsx`
**Severity:** Low — Dead code

### Problem
Lines 64-72: The component checks `if (!src)` and renders a "no video message". However, the parent `MovieWatchPage.jsx` already handles this case (line 82-84):
```jsx
{currentVideoUrl ? (
    <VideoPlayer src={currentVideoUrl} ... />
) : (
    <div className="no-video-message">Select an episode to start watching</div>
)}
```

### Fix
Remove the redundant check since the parent handles it:

```jsx
// REMOVE these lines (64-72):
if (!src) {
    return (
        <div className="video-player-wrapper">
            <div className="no-video-message">Select an episode to start watching</div>
        </div>
    );
}
```

**Note:** Keep the check only if `VideoPlayer` is used elsewhere without a parent guard. If keeping it for defensive programming, add a comment explaining why.

---

## Issue 6: CODE QUALITY — Missing error state in MovieWatchPage.jsx

**File:** `frontend/src/pages/MovieWatchPage.jsx`
**Severity:** Medium — User sees infinite loading on network errors

### Problem
The `catch` block (line 30-32) only logs to console but doesn't update any UI state. The user sees "Loading..." forever if the API fails.

### Fix
Add an error state:

```jsx
// Add to state declarations
const [error, setError] = useState(null);

// Update the useEffect catch block
useEffect(() => {
    const fetchData = async () => {
        try {
            const movieRes = await fetch(`${MOVIE_URL}/${id}`);
            if (!movieRes.ok) {
                throw new Error(`HTTP error! status: ${movieRes.status}`);
            }
            const movieData = await movieRes.json();
            setMovie(movieData);

            const mockFiles = generateMockFiles(movieData);
            setFiles(mockFiles);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching movie data:", error);
            setError(error.message);
            setLoading(false);
        }
    };
    fetchData();
}, [id]);

// Add error UI to the render
if (error) return <div className="watch-error">Error: {error}</div>;
if (loading) return <div className="watch-loading">Loading...</div>;
if (!movie) return <div className="watch-error">Movie not found</div>;
```

---

## Bonus: Minor improvements (optional)

### B1. Safe access for `files.flatMap`
In the `providers` calculation, add defensive check:
```jsx
const providers = useMemo(() => {
    if (!files.length) return [];
    return [...new Set(files.flatMap(f => f.sources?.map(s => s.provider) || []))];
}, [files]);
```

### B2. Move `generateMockFiles` to a separate file
The mock data function should be in `frontend/src/test/mockData.js` or similar, not inline in the page component. This keeps the component focused on UI logic.

### B3. Add `key` prop safety in episode buttons
The current code uses `index` as key which is fine for static lists, but consider using a more stable key:
```jsx
<button
    key={`${provider}-${file.episode || 'movie'}`}
    // ...
>
```

---

## Files to Modify

| File | Issues | Priority |
|------|--------|----------|
| `frontend/src/components/player/VideoPlayer.jsx` | #1, #2, #5 | High |
| `frontend/src/pages/MovieWatchPage.jsx` | #3, #4, #6 | Medium |

## Estimated Effort
- **Critical fixes (Issues #1, #2):** 5 minutes
- **Performance fixes (Issues #3, #4):** 10 minutes
- **Quality fixes (Issues #5, #6):** 10 minutes
- **Total:** ~25 minutes

## Testing Checklist
After applying fixes:
- [ ] Verify HLS stream plays correctly with custom config
- [ ] Verify HLS errors are logged to console
- [ ] Verify episode switching works without re-render issues
- [ ] Verify error state displays on network failure
- [ ] Verify no console warnings about missing dependencies