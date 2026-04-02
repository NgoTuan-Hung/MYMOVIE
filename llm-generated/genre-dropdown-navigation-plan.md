# Genre Dropdown Navigation - Implementation Plan

## Feature Overview

Add a hover-activated dropdown popup to the "Genres" navigation item in the navbar. When users hover over "Genres", a popup will appear displaying all available genre options. Clicking on a genre will navigate to the MovieFilterPage with that genre pre-selected as a filter.

---

## Requirements

### Functional Requirements
1. **Hover Trigger**: Dropdown appears when user hovers over "Genres" nav item
2. **Genre Display**: Show all available genres from `FILTER_OPTIONS.categories`
3. **Navigation**: Clicking a genre navigates to `/movie?category=GenreName`
4. **Dismiss**: Dropdown closes when mouse leaves the dropdown area
5. **Keyboard Accessibility**: Support keyboard navigation (Tab, Enter, Escape)

### Non-Functional Requirements
1. **Scalable**: Easy to add/remove genres without code changes
2. **Performant**: No unnecessary re-renders or API calls
3. **Accessible**: ARIA attributes for screen readers
4. **Responsive**: Works on all screen sizes
5. **Consistent Styling**: Matches existing dark theme and design system

---

## Architecture Design

### Component Structure

```
NavigationBar
├── Logo
├── SearchBar
├── NavLinks
│   ├── Home Link
│   ├── Movies Link
│   ├── TV Shows Link
│   └── Genres Container (NEW)
│       ├── Genres Trigger Link
│       └── Genre Dropdown Popup (NEW)
│           ├── Genre Item 1
│           ├── Genre Item 2
│           ├── ...
│           └── Genre Item N
└── (other items)
```

### Data Flow

```
User hovers "Genres"
    ↓
setIsDropdownOpen(true)
    ↓
Dropdown renders with genre list
    ↓
User clicks "Action"
    ↓
navigate('/movie?category=Action')
    ↓
MovieFilterPage receives category filter
    ↓
useMovieFilter applies category filter
    ↓
API fetches filtered movies
```

---

## Detailed Code Changes

### 1. Modify `frontend/src/components/NavigationBar.jsx`

**Changes:**
- Add `useState` for dropdown open/close state
- Add `useRef` for detecting outside clicks
- Add `useEffect` for handling Escape key
- Transform "Genres" nav item into a container with trigger + dropdown
- Import genre options from `myMovieApi`

**Updated File Content:**

```jsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { FILTER_OPTIONS } from "../test/myMovieApi";
import "../styles/navbar.css";

const navItems = [
    { label: "Home", path: "/" },
    { label: "Movies", path: "/movie" },
    { label: "TV Shows", path: "/tv" },
];

export default function NavigationBar() {
    const navigate = useNavigate();
    const [isGenresOpen, setIsGenresOpen] = useState(false);
    const genresRef = useRef(null);
    let closeTimeoutRef = useRef(null);

    const handleSearch = (q) => {
        navigate(`/movie?search=${q}`);
    };

    const handleGenreClick = (genre) => {
        setIsGenresOpen(false);
        navigate(`/movie?category=${encodeURIComponent(genre)}`);
    };

    const handleMouseEnter = () => {
        clearTimeout(closeTimeoutRef.current);
        setIsGenresOpen(true);
    };

    const handleMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setIsGenresOpen(false);
        }, 150); // Small delay to prevent flickering
    };

    // Close dropdown on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsGenresOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (genresRef.current && !genresRef.current.contains(e.target)) {
                setIsGenresOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => clearTimeout(closeTimeoutRef.current);
    }, []);

    return (
        <nav className="navbar">
            {/* Logo */}
            <Link to="/" className="logo">
                🎬 MyMovie
            </Link>

            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} />

            {/* Navigation Links */}
            <div className="nav-links">
                {navItems.map((item) => (
                    <Link key={item.label} to={item.path} className="nav-link">
                        {item.label}
                    </Link>
                ))}

                {/* Genres Dropdown Container */}
                <div
                    className="genres-dropdown-container"
                    ref={genresRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <button
                        className={`nav-link genres-trigger ${isGenresOpen ? "active" : ""}`}
                        aria-haspopup="true"
                        aria-expanded={isGenresOpen}
                        aria-label="Browse by genre"
                    >
                        Genres
                        <svg
                            className={`dropdown-arrow ${isGenresOpen ? "rotated" : ""}`}
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M2.5 4.5L6 8L9.5 4.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    {/* Dropdown Popup */}
                    {isGenresOpen && (
                        <div
                            className="genres-dropdown"
                            role="menu"
                            aria-label="Genre selection"
                        >
                            <div className="genres-grid">
                                {FILTER_OPTIONS.categories.map((genre) => (
                                    <button
                                        key={genre}
                                        className="genre-item"
                                        role="menuitem"
                                        onClick={() => handleGenreClick(genre)}
                                    >
                                        {genre}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
```

**Key Changes Explained:**

| Change | Purpose |
|--------|---------|
| `useState(isGenresOpen)` | Track dropdown visibility state |
| `useRef(genresRef)` | Reference for click-outside detection |
| `useRef(closeTimeoutRef)` | Prevent flickering on rapid hover |
| `handleMouseEnter/Leave` | Smooth open/close with delay |
| `handleGenreClick` | Navigate with genre query parameter |
| `aria-*` attributes | Accessibility support |
| Dropdown arrow SVG | Visual indicator for dropdown |

---

### 2. Modify `frontend/src/styles/navbar.css`

**Changes:**
- Add styles for the dropdown container
- Add styles for the dropdown popup
- Add styles for genre items in grid layout
- Add hover/active states
- Add responsive breakpoints

**CSS to Add:**

```css
/* ============================================
   Genres Dropdown Styles
   ============================================ */

/* Container for genres dropdown */
.genres-dropdown-container {
    position: relative;
    display: inline-block;
}

/* Genres trigger button (styled like nav-link) */
.genres-trigger {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: inherit;
    font-family: inherit;
}

.genres-trigger.active {
    color: var(--accent);
}

/* Dropdown arrow */
.dropdown-arrow {
    transition: transform 0.2s ease;
}

.dropdown-arrow.rotated {
    transform: rotate(180deg);
}

/* Dropdown popup */
.genres-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--navy-dark);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 16px;
    min-width: 320px;
    max-width: 480px;
    z-index: 1100; /* Higher than navbar z-index (1000) */
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    animation: dropdownFadeIn 0.2s ease-out;
}

/* Arrow pointer at top of dropdown */
.genres-dropdown::before {
    content: "";
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 16px;
    background-color: var(--navy-dark);
    border-left: 1px solid var(--border-color);
    border-top: 1px solid var(--border-color);
    transform: translateX(-50%) rotate(45deg);
}

/* Invisible bridge to prevent gap between trigger and dropdown */
.genres-dropdown::after {
    content: "";
    position: absolute;
    top: -12px;
    left: 0;
    right: 0;
    height: 12px;
}

/* Genre items grid */
.genres-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
}

/* Individual genre item */
.genre-item {
    padding: 10px 16px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 6px;
    color: var(--text-primary);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    white-space: nowrap;
}

.genre-item:hover {
    background-color: var(--accent);
    color: white;
    border-color: var(--accent);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 200, 150, 0.3);
}

.genre-item:active {
    transform: translateY(0);
}

.genre-item:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

/* Dropdown fade-in animation */
@keyframes dropdownFadeIn {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(-8px);
    }
    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}

/* Mobile responsive */
@media (max-width: 768px) {
    .genres-dropdown {
        position: fixed;
        top: auto;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100vw - 32px);
        max-width: 400px;
        margin-top: 8px;
    }

    .genres-dropdown::before {
        display: none; /* Hide arrow on mobile */
    }

    .genres-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Tablet responsive */
@media (max-width: 1024px) {
    .genres-dropdown {
        min-width: 280px;
    }

    .genres-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
```

---

### 3. Modify `frontend/src/hooks/useMovieFilter.js`

**Changes:**
- Add URL parameter parsing for `category` query parameter
- Initialize filters from URL on mount

**Updated File Content:**

```javascript
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchMoviesByFilter } from '../test/myMovieApi';

// Used by BOTH /movie and /tv pages
// defaultType: "movie" for movies page, "series" for TV page
export const useMovieFilter = (defaultType = 'movie') => {
    const [searchParams] = useSearchParams();

    // Initialize filters from URL parameters
    const [filters, setFilters] = useState({
        sort: searchParams.get('sort') || '',
        category: searchParams.get('category') || '',
        country: searchParams.get('country') || '',
        releaseYear: searchParams.get('releaseYear') || '',
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

**Key Changes:**
- Added `useSearchParams` import from `react-router-dom`
- Initialize `filters` state from URL query parameters
- This allows direct navigation via URL like `/movie?category=Action`

---

## File Summary

| File | Action | Description |
|------|--------|-------------|
| `frontend/src/components/NavigationBar.jsx` | Modify | Add dropdown state management and genre popup UI |
| `frontend/src/styles/navbar.css` | Modify | Add dropdown, grid, and animation styles |
| `frontend/src/hooks/useMovieFilter.js` | Modify | Parse URL parameters for category filter |

---

## Visual Design Specifications

### Dropdown Layout
```
┌─────────────────────────────────────────┐
│           Genres ▼                       │ ← Trigger (navbar item)
└─────────────────────────────────────────┘
                    ▼
        ┌───────────────────────┐
        │  ┌─────────┬─────────┐ │
        │  │ Action  │ Comedy  │ │
        │  ├─────────┼─────────┤ │
        │  │ Drama   │ Horror  │ │
        │  ├─────────┼─────────┤ │
        │  │ Sci-Fi  │ Romance │ │
        │  ├─────────┼─────────┤ │
        │  │Thriller │  ...    │ │
        │  └─────────┴─────────┘ │
        └───────────────────────┘
```

### Color Scheme (using CSS variables)
- **Background**: `var(--navy-dark)` - matches navbar
- **Border**: `var(--border-color)` - subtle border
- **Text**: `var(--text-primary)` - primary text color
- **Hover Background**: `var(--accent)` - accent color
- **Hover Text**: `white`
- **Shadow**: `rgba(0, 0, 0, 0.4)` - depth effect
- **Glow on hover**: `rgba(0, 200, 150, 0.3)` - accent glow

### Animation
- **Duration**: 200ms
- **Easing**: ease-out
- **Effect**: Fade in + slight upward movement
- **Arrow rotation**: 180deg when open

---

## Scalability Considerations

### Adding New Genres
Genres are sourced from `FILTER_OPTIONS.categories` in `myMovieApi.js`. To add a new genre:

```javascript
// frontend/src/test/myMovieApi.js
export const FILTER_OPTIONS = {
    // ...
    categories: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'NEW_GENRE'],
    // ...
};
```

The dropdown will automatically render the new genre without any additional code changes.

### Dynamic Genre Count Handling
The CSS grid uses `grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))` which automatically adjusts the number of columns based on:
- Available space
- Number of genres
- Minimum item width (120px)

This ensures the dropdown looks good whether there are 5 genres or 50 genres.

### Future Enhancements
1. **Genre Icons**: Add emoji/icons next to genre names
2. **Popular Genres Highlight**: Highlight frequently browsed genres
3. **Multi-select**: Allow selecting multiple genres at once
4. **Genre Descriptions**: Add short descriptions on hover
5. **Recent Genres**: Show recently browsed genres at the top

---

## Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Keyboard Navigation | Tab through genres, Enter to select, Escape to close |
| ARIA Roles | `role="menu"` on dropdown, `role="menuitem"` on items |
| ARIA States | `aria-expanded` on trigger button |
| Focus Management | `focus-visible` outline styling |
| Screen Reader Labels | `aria-label` on trigger and dropdown |
| Click Outside | Closes dropdown when clicking outside |

---

## Testing Checklist

### Functional Testing
- [ ] Hover over "Genres" shows dropdown
- [ ] Dropdown displays all genres from FILTER_OPTIONS
- [ ] Clicking a genre navigates to `/movie?category=GenreName`
- [ ] MovieFilterPage shows filtered results for selected genre
- [ ] Dropdown closes on mouse leave
- [ ] Dropdown closes on Escape key press
- [ ] Dropdown closes when clicking outside
- [ ] No flickering on rapid hover

### Visual Testing
- [ ] Dropdown aligns with "Genres" nav item
- [ ] Arrow pointer points to trigger
- [ ] Grid layout adapts to different genre counts
- [ ] Hover effects work correctly
- [ ] Animation is smooth
- [ ] Dark theme colors are consistent

### Responsive Testing
- [ ] Works on desktop (1920px+)
- [ ] Works on laptop (1024px - 1920px)
- [ ] Works on tablet (768px - 1024px)
- [ ] Works on mobile (< 768px)
- [ ] Touch interactions work on mobile

### Accessibility Testing
- [ ] Tab navigation works
- [ ] Enter key selects genre
- [ ] Escape key closes dropdown
- [ ] Screen reader announces dropdown correctly
- [ ] Focus indicators are visible

### Edge Cases
- [ ] Works with empty categories array
- [ ] Works with single genre
- [ ] Works with many genres (20+)
- [ ] Handles special characters in genre names
- [ ] URL encoding works for genre names with spaces

---

## Implementation Order

1. **Step 1**: Update `useMovieFilter.js` to parse URL parameters
2. **Step 2**: Update `NavigationBar.jsx` with dropdown component
3. **Step 3**: Add CSS styles to `navbar.css`
4. **Step 4**: Test functionality and styling
5. **Step 5**: Test responsiveness and accessibility
6. **Step 6**: Final review and cleanup

---

## Potential Issues and Solutions

| Issue | Solution |
|-------|----------|
| Dropdown flickers on hover | Added 150ms delay timeout before closing |
| Gap between trigger and dropdown | Added invisible bridge with `::after` pseudo-element |
| Dropdown goes off-screen | Use `left: 50%` + `transform: translateX(-50%)` for centering |
| Z-index conflicts | Set dropdown z-index to 1100 (above navbar's 1000) |
| URL not updating filter | Added `useSearchParams` to initialize filters from URL |
| Genre names with spaces | Use `encodeURIComponent()` in navigation |

---

## Summary

This implementation adds a clean, scalable genre dropdown to the navigation bar that:
- Activates on hover with smooth animations
- Displays genres in a responsive grid layout
- Navigates to filtered movie results on click
- Integrates seamlessly with the existing dark theme
- Supports keyboard navigation and screen readers
- Is easily extensible for adding new genres