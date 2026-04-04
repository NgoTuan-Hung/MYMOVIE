# HomePage Redesign Plan — Match MovieFilterPage Theme/Style

## Overview

Redesign `frontend/src/test/HomePage.jsx` to reuse the same components, CSS classes, and visual theme as `MovieFilterPage.jsx`. This eliminates duplicated inline styles and ensures a consistent UI across the app.

---

## Current State Analysis

### HomePage.jsx (Current)
- Uses **inline styles** for everything (grid, cards, headings, text)
- Has two sections: "Hot Movies" and "All Movies"
- Fetches data via `fetchHotMovies()` and `fetchMovies()`
- Renders its own card markup (duplicated logic from `MovieCard`)
- Fixed 5-column grid with no responsive breakpoints

### MovieFilterPage.jsx (Target Style)
- Uses **modular components**: `FilterControls`, `MovieGrid`, `Pagination`
- Uses **CSS files**: `filter-page.css`, `movie-grid.css`, `movie-card.css`, `pagination.css`, `filter-controls.css`
- Uses **CSS custom properties** (variables) for theming: `--bg-card`, `--accent`, `--border-color`, etc.
- Responsive grid: 5 → 3 → 2 → 1 columns via media queries
- `MovieCard` component handles poster, title, meta info with hover effects

---

## Reusable Components Available

| Component | Path | Purpose |
|-----------|------|---------|
| `MovieGrid` | `src/components/filter/MovieGrid.jsx` | Renders a responsive grid of `MovieCard` components |
| `MovieCard` | `src/components/filter/MovieCard.jsx` | Individual movie card with poster, title, meta info |
| `FilterControls` | `src/components/filter/FilterControls.jsx` | Filter dropdowns (sort, category, country, year) |
| `Pagination` | `src/components/filter/Pagination.jsx` | Page navigation buttons |

## CSS Files Available

| CSS File | Path | Purpose |
|----------|------|---------|
| `movie-grid.css` | `src/styles/movie-grid.css` | Responsive grid layout (5/3/2/1 columns) |
| `movie-card.css` | `src/styles/movie-card.css` | Card styling with hover effects, poster, title, meta |
| `filter-controls.css` | `src/styles/filter-controls.css` | Filter bar styling |
| `filter-page.css` | `src/styles/filter-page.css` | Page container, loading, error, empty states |
| `pagination.css` | `src/styles/pagination.css` | Pagination button styling |

---

## Detailed Changes

### 1. File: `frontend/src/test/HomePage.jsx`

#### Imports — Change From:
```jsx
import { useEffect, useState } from "react";
import { fetchMovies, fetchHotMovies, getPosterUrl } from "./myMovieApi";
import { Link } from "react-router-dom";
```

#### Imports — Change To:
```jsx
import { useEffect, useState } from "react";
import { fetchMovies, fetchHotMovies } from "./myMovieApi";
import MovieGrid from "../components/filter/MovieGrid";
import "../styles/filter-page.css";
import "../styles/movie-grid.css";
```

**Rationale**: Remove `getPosterUrl` and `Link` imports since `MovieGrid`/`MovieCard` handle rendering internally. Add CSS imports for consistent styling.

---

#### JSX — Change From:
```jsx
return (
    <div>
        {/* Hot Movies Section */}
        {hotMovies.length > 0 && (
            <div style={{ marginBottom: "40px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", color: "#d32f2f" }}>
                    🔥 Hot Movies
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px" }}>
                    {hotMovies.map(movie => (
                        <Link to={`/movie/${movie.id}`} key={movie.id} style={{ textDecoration: "none", color: "inherit" }}>
                            <div style={{ border: "1px solid #ccc", padding: "10px", cursor: "pointer" }}>
                                <img src={getPosterUrl(movie.posterUrl)} alt={movie.displayName}
                                     style={{ width: "100%", height: "300px", objectFit: "cover" }} />
                                <h3 style={{ fontSize: "16px", marginTop: "10px", marginBottom: "5px" }}>{movie.displayName}</h3>
                                <p style={{ fontSize: "14px", color: "#666", margin: "0" }}>{movie.releaseYear}</p>
                                <p style={{ fontSize: "14px", color: "#666", margin: "0" }}>{movie.duration} min</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )}

        {/* All Movies Section */}
        <div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
                🎬 All Movies
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px" }}>
                {allMovies.map(movie => (
                    <Link to={`/movie/${movie.id}`} key={movie.id} style={{ textDecoration: "none", color: "inherit" }}>
                        <div style={{ border: "1px solid #ccc", padding: "10px", cursor: "pointer" }}>
                            <img src={getPosterUrl(movie.posterUrl)} alt={movie.displayName}
                                 style={{ width: "100%", height: "300px", objectFit: "cover" }} />
                            <h3 style={{ fontSize: "16px", marginTop: "10px", marginBottom: "5px" }}>{movie.displayName}</h3>
                            <p style={{ fontSize: "14px", color: "#666", margin: "0" }}>{movie.releaseYear}</p>
                            <p style={{ fontSize: "14px", color: "#666", margin: "0" }}>{movie.duration} min</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </div>
);
```

#### JSX — Change To:
```jsx
return (
    <div className="filter-page">
        {/* Hot Movies Section */}
        {hotMovies.length > 0 && (
            <section style={{ marginBottom: "40px" }}>
                <h2 className="page-title" style={{ color: "var(--accent)" }}>
                    🔥 Hot Movies
                </h2>
                <MovieGrid movies={hotMovies} />
            </section>
        )}

        {/* All Movies Section */}
        <section>
            <h2 className="page-title">
                🎬 All Movies
            </h2>
            <MovieGrid movies={allMovies} />
        </section>
    </div>
);
```

**Rationale**:
- Wrap content in `<div className="filter-page">` to inherit the same page container styling as `MovieFilterPage` (max-width, margin, padding).
- Use `<h2 className="page-title">` for section headings — this reuses the same CSS class from `filter-page.css` (28px, bold, proper spacing).
- Replace inline grid + card markup with `<MovieGrid>` component — this automatically applies responsive grid layout and styled movie cards.
- Use `style={{ color: "var(--accent)" }}` only for the "Hot Movies" heading to give it the red accent color, matching the visual hierarchy of the original design.

---

### 2. No Changes Needed To:

| File | Reason |
|------|--------|
| `MovieGrid.jsx` | Already generic — accepts any `movies` array |
| `MovieCard.jsx` | Already handles poster URL via `getPosterUrl`, renders title/meta |
| `movie-grid.css` | Already has responsive breakpoints |
| `movie-card.css` | Already has hover effects, theming via CSS variables |
| `filter-page.css` | Already has `.page-title`, `.loading`, `.empty-state` classes |

---

## Complete New HomePage.jsx Content

```jsx
import { useEffect, useState } from "react";
import { fetchMovies, fetchHotMovies } from "./myMovieApi";
import MovieGrid from "../components/filter/MovieGrid";
import "../styles/filter-page.css";
import "../styles/movie-grid.css";

export default function HomePage() {
    const [hotMovies, setHotMovies] = useState([]);
    const [allMovies, setAllMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [hotData, allData] = await Promise.all([
                    fetchHotMovies(10),
                    fetchMovies()
                ]);
                setHotMovies(hotData);
                setAllMovies(allData);
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading">Loading movies...</div>;
    }

    return (
        <div className="filter-page">
            {/* Hot Movies Section */}
            {hotMovies.length > 0 && (
                <section style={{ marginBottom: "40px" }}>
                    <h2 className="page-title" style={{ color: "var(--accent)" }}>
                        🔥 Hot Movies
                    </h2>
                    <MovieGrid movies={hotMovies} />
                </section>
            )}

            {/* All Movies Section */}
            <section>
                <h2 className="page-title">
                    🎬 All Movies
                </h2>
                <MovieGrid movies={allMovies} />
            </section>
        </div>
    );
}
```

---

## Summary of Changes

| Change | Before | After |
|--------|--------|-------|
| **Card rendering** | Inline JSX with styles | `<MovieGrid>` component |
| **Grid layout** | Inline `gridTemplateColumns: "repeat(5, 1fr)"` | CSS class `.movie-grid` (responsive) |
| **Card styling** | Inline `border`, `padding`, `cursor` | CSS class `.movie-card` (hover effects, theming) |
| **Heading styling** | Inline `fontSize`, `fontWeight`, `marginBottom` | CSS class `.page-title` |
| **Loading state** | Inline `textAlign`, `padding` | CSS class `.loading` |
| **Page container** | No wrapper class | `<div className="filter-page">` |
| **CSS imports** | None | `filter-page.css`, `movie-grid.css` |
| **Removed imports** | `getPosterUrl`, `Link` | — (handled by MovieCard) |

---

## Benefits

1. **Consistent Theme**: HomePage now uses the same CSS variables (`--bg-card`, `--accent`, `--border-color`, etc.) as MovieFilterPage
2. **Responsive Design**: Grid adapts from 5 → 3 → 2 → 1 columns via existing media queries
3. **Hover Effects**: Cards get `translateY(-4px)`, shadow, and border color change on hover
4. **Less Code**: Removes ~50 lines of duplicated inline card markup
5. **Maintainability**: Future style changes to `MovieCard` or `movie-grid.css` automatically apply to HomePage
6. **No New Files**: Reuses existing components and CSS — zero new dependencies

---

## Files to Modify

| File | Action |
|------|--------|
| `frontend/src/test/HomePage.jsx` | Rewrite content (see "Complete New HomePage.jsx Content" above) |

## Files NOT to Modify

| File | Reason |
|------|--------|
| `frontend/src/components/filter/MovieGrid.jsx` | Already generic and reusable |
| `frontend/src/components/filter/MovieCard.jsx` | Already handles all card rendering |
| `frontend/src/styles/movie-grid.css` | Already has responsive breakpoints |
| `frontend/src/styles/movie-card.css` | Already has complete card styling |
| `frontend/src/styles/filter-page.css` | Already has page container and heading styles |
| `frontend/src/App.jsx` | No routing changes needed |

---

## Execution Steps (When Ready)

1. Open `frontend/src/test/HomePage.jsx`
2. Replace entire file content with the "Complete New HomePage.jsx Content" shown above
3. Save the file
4. Run the dev server (`npm run dev` in the `frontend/` directory)
5. Verify:
   - Hot Movies section displays with red accent heading
   - All Movies section displays with standard heading
   - Cards have hover effects (lift + shadow + red border)
   - Grid is responsive (resize browser to test)
   - Loading state uses the same styling as MovieFilterPage