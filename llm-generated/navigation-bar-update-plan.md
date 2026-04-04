# Navigation Bar Update Plan

## Overview
Add two new navigation elements to the NavigationBar:
1. **Country dropdown** - A hover-triggered dropdown modal similar to the existing Genres dropdown
2. **Animation button** - A single navigation link pointing to `/movie?genre=animation`

The existing Genres dropdown will be extracted into a reusable `DropdownMenu` component to avoid code duplication between Genres and Country dropdowns.

---

## Changes Summary

### 1. Create Reusable `DropdownMenu` Component
**File:** `frontend/src/components/DropdownMenu.jsx` (NEW)

Extract the dropdown logic into a reusable component that accepts:
- `triggerLabel` (string) - The text shown on the nav button (e.g., "Genres", "Country")
- `items` (array) - List of items to display in the dropdown grid
- `onItemClick` (function) - Callback when an item is clicked
- `ariaLabel` (string) - Accessibility label

```jsx
import { useState, useRef, useEffect } from "react";
import "../styles/navbar.css";

export default function DropdownMenu({ triggerLabel, items, onItemClick, ariaLabel }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    let closeTimeoutRef = useRef(null);

    const handleMouseEnter = () => {
        clearTimeout(closeTimeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };

    const handleItemClick = (item) => {
        setIsOpen(false);
        onItemClick(item);
    };

    // Close dropdown on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
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
        <div
            className="genres-dropdown-container"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                className={`nav-link genres-trigger ${isOpen ? "active" : ""}`}
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label={ariaLabel}
            >
                {triggerLabel}
                <svg
                    className={`dropdown-arrow ${isOpen ? "rotated" : ""}`}
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

            {isOpen && (
                <div
                    className="genres-dropdown"
                    role="menu"
                    aria-label={ariaLabel}
                >
                    <div className="genres-grid">
                        {items.map((item) => (
                            <button
                                key={item}
                                className="genre-item"
                                role="menuitem"
                                onClick={() => handleItemClick(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
```

---

### 2. Update `NavigationBar.jsx`
**File:** `frontend/src/components/NavigationBar.jsx`

**Changes:**
- Import the new `DropdownMenu` component
- Import `FILTER_OPTIONS` (already imported)
- Add "Animation" as a simple nav link
- Add "Country" dropdown using the reusable `DropdownMenu` component
- Reduce `nav-links` gap from `20px` to `14px` to fit all items comfortably
- Remove the inline dropdown logic (now handled by `DropdownMenu`)

**Updated file content:**

```jsx
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import DropdownMenu from "./DropdownMenu";
import { FILTER_OPTIONS } from "../test/myMovieApi";
import "../styles/navbar.css";

const navItems = [
    { label: "Home", path: "/" },
    { label: "Movies", path: "/movie?type=movie" },
    { label: "TV Shows", path: "/movie?type=series" },
    { label: "Animation", path: "/movie?genre=animation" },
];

export default function NavigationBar() {
    const navigate = useNavigate();

    const handleSearch = (q) => {
        navigate(`/movie?search=${q}`);
    };

    const handleGenreClick = (genre) => {
        navigate(`/movie?category=${encodeURIComponent(genre)}`);
    };

    const handleCountryClick = (country) => {
        navigate(`/movie?country=${encodeURIComponent(country)}`);
    };

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

                {/* Genres Dropdown */}
                <DropdownMenu
                    triggerLabel="Genres"
                    items={FILTER_OPTIONS.categories}
                    onItemClick={handleGenreClick}
                    ariaLabel="Browse by genre"
                />

                {/* Country Dropdown */}
                <DropdownMenu
                    triggerLabel="Country"
                    items={FILTER_OPTIONS.countries}
                    onItemClick={handleCountryClick}
                    ariaLabel="Browse by country"
                />
            </div>
        </nav>
    );
}
```

**Note:** Also need to add `import { Link } from "react-router-dom";` since it was in the original but missing from my draft above. The final file should keep the `Link` import.

---

### 3. Update `navbar.css`
**File:** `frontend/src/styles/navbar.css`

**Changes:**
- Reduce `.nav-links` gap from `20px` to `14px` to accommodate the new buttons
- No other CSS changes needed since the `DropdownMenu` reuses the existing class names (`genres-dropdown-container`, `genres-dropdown`, `genres-grid`, `genre-item`, etc.)

**Specific change:**

```css
/* BEFORE (line 25-28) */
.nav-links {
    display: flex;
    gap: 20px;
}

/* AFTER */
.nav-links {
    display: flex;
    gap: 14px;
    align-items: center;
}
```

---

## File Structure After Changes

```
frontend/src/
├── components/
│   ├── NavigationBar.jsx       (UPDATED - simplified, uses DropdownMenu)
│   ├── DropdownMenu.jsx        (NEW - reusable dropdown component)
│   └── ...
├── styles/
│   └── navbar.css              (UPDATED - reduced gap)
└── ...
```

---

## Navigation Bar Layout (Visual)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🎬 MyMovie    [Search Bar...]    Home | Movies | TV Shows |        │
│                                    Animation | Genres ▼ | Country ▼│
└─────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Steps

1. **Create** `frontend/src/components/DropdownMenu.jsx` with the reusable dropdown component
2. **Update** `frontend/src/components/NavigationBar.jsx`:
   - Replace inline dropdown logic with `DropdownMenu` component
   - Add "Animation" link to `navItems` array
   - Add "Country" dropdown using `DropdownMenu`
   - Remove unused imports (`useState`, `useRef`, `useEffect`)
   - Remove unused state and handlers for the old inline dropdown
3. **Update** `frontend/src/styles/navbar.css`:
   - Change `.nav-links` gap from `20px` to `14px`
   - Add `align-items: center` for vertical alignment consistency

---

## Testing Checklist

- [ ] Genres dropdown opens on hover and closes on mouse leave
- [ ] Country dropdown opens on hover and closes on mouse leave
- [ ] Clicking a genre navigates to `/movie?category=ACTION` (example)
- [ ] Clicking a country navigates to `/movie?country=US` (example)
- [ ] Clicking "Animation" navigates to `/movie?genre=animation`
- [ ] Dropdowns close when pressing Escape key
- [ ] Dropdowns close when clicking outside
- [ ] All nav items are visible and not overlapping on standard desktop (1920x1080)
- [ ] Nav bar is responsive on tablet (1024px) and mobile (768px)
- [ ] No console errors or warnings

---

## Notes

- The `DropdownMenu` component is fully reusable and can be used for any future dropdown needs
- The CSS class names are kept the same (`genres-dropdown-container`, etc.) to avoid duplicating styles. If desired, these can be renamed to more generic names like `dropdown-container` in a future refactor
- The `FILTER_OPTIONS.countries` array already exists in `myMovieApi.js` with values: `['US', 'UK', 'Japan', 'South Korea', 'France', 'Germany', 'Canada']`
- The Animation link uses `genre=animation` as the query param, which should be handled by the existing filter logic on the movie page