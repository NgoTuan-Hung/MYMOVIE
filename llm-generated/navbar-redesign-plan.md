# Navigation Bar Redesign Plan

## Problem Analysis

The current navigation bar has the following issues:
1. **All elements packed together** — Logo, SearchBar, nav links, and two dropdowns (Genres, Country) are all in a single row with `justify-content: space-between`, causing crowding
2. **Country dropdown nearly out of bounds** — With 8 items in a single flex row, the rightmost elements overflow or appear cramped
3. **No breathing room** — The `gap: 14px` is insufficient for the number of elements

### Current Layout (Single Row)
```
[🎬 MyMovie]                    [Search Bar....................] [Home] [Movies] [TV Shows] [Animation] [Genres▾] [Country▾]
```

## Proposed Solution: Two-Row Layout

Split the navbar into **two rows** for better spacing and readability:

- **Row 1 (Top Bar):** Logo + Search Bar
- **Row 2 (Navigation Bar):** Nav links + Dropdowns

### Visual Mockup
```
┌─────────────────────────────────────────────────────────────┐
│  🎬 MyMovie              [Search Bar....................]   │  ← Top Bar
├─────────────────────────────────────────────────────────────┤
│  [Home]  [Movies]  [TV Shows]  [Animation]  [Genres▾] [Country▾] │  ← Nav Bar
└─────────────────────────────────────────────────────────────┘
```

---

## File Changes

### 1. `frontend/src/components/NavigationBar.jsx`

**Changes:**
- Wrap the navbar in a `<header>` container for semantic structure
- Split into two distinct `<div>` rows: `.navbar-top` and `.navbar-bottom`
- Move Logo and SearchBar to `.navbar-top`
- Move all nav links and dropdowns to `.navbar-bottom`

```jsx
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import DropdownMenu from "./DropdownMenu";
import { FILTER_OPTIONS } from "../test/myMovieApi";
import "../styles/navbar.css";
import { Link } from "react-router-dom";

const navItems = [
    { label: "Home", path: "/" },
    { label: "Movies", path: "/movie?type=movie" },
    { label: "TV Shows", path: "/movie?type=series" },
    { label: "Animation", path: "/movie?category=animation" },
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
        <header className="navbar-wrapper">
            {/* Top Row: Logo + Search */}
            <div className="navbar-top">
                <Link to="/" className="logo">
                    🎬 MyMovie
                </Link>
                <SearchBar onSearch={handleSearch} />
            </div>

            {/* Bottom Row: Navigation Links + Dropdowns */}
            <nav className="navbar-bottom">
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
        </header>
    );
}
```

---

### 2. `frontend/src/styles/navbar.css`

**Changes:**
- Replace `.navbar` with `.navbar-wrapper`, `.navbar-top`, and `.navbar-bottom`
- Add proper spacing, padding, and visual separation between rows
- Slightly reduce font sizes for nav items (from default ~16px to 14px)
- Increase gap between nav items for breathing room
- Add responsive breakpoints for tablet and mobile

```css
/* ============================================
   Navbar Wrapper (Container)
   ============================================ */
.navbar-wrapper {
    background-color: var(--navy-dark);
    color: white;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* ============================================
   Top Row: Logo + Search
   ============================================ */
.navbar-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 30px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo {
    font-size: 26px;
    font-weight: bold;
    color: white;
    text-decoration: none;
    white-space: nowrap;
}

.logo:hover {
    color: var(--accent);
}

/* ============================================
   Bottom Row: Navigation Links
   ============================================ */
.navbar-bottom {
    padding: 0 30px;
}

.nav-links {
    display: flex;
    gap: 6px;
    align-items: center;
    padding: 10px 0;
}

.nav-link {
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    padding: 8px 14px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--accent);
}

/* ============================================
   Search Bar Styles
   ============================================ */
.search-bar {
    display: flex;
    align-items: center;
    gap: 10px;
}

.search-input {
    padding: 10px 14px;
    border-radius: 6px;
    border: 1px solid var(--border-color);
    width: 350px;
    font-size: 14px;
    outline: none;
    background: var(--bg-input);
    color: var(--text-primary);
}

.search-input::placeholder {
    color: var(--text-muted);
}

.search-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent-glow);
}

.search-button {
    padding: 10px 18px;
    background-color: var(--accent);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.search-button:hover {
    background-color: var(--accent-hover);
    transform: translateY(-1px);
}

/* ============================================
   Dropdown Menu Styles
   ============================================ */
.genres-dropdown-container {
    position: relative;
    display: inline-block;
}

.genres-trigger {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 500;
    font-family: inherit;
    color: rgba(255, 255, 255, 0.85);
    padding: 8px 14px;
    border-radius: 6px;
    transition: all 0.2s ease;
}

.genres-trigger:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--accent);
}

.genres-trigger.active {
    color: var(--accent);
    background-color: rgba(255, 255, 255, 0.08);
}

.dropdown-arrow {
    transition: transform 0.2s ease;
}

.dropdown-arrow.rotated {
    transform: rotate(180deg);
}

/* Dropdown popup */
.genres-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--navy-dark);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 16px;
    min-width: 320px;
    max-width: 480px;
    z-index: 1100;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    animation: dropdownFadeIn 0.2s ease-out;
}

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

.genres-dropdown::after {
    content: "";
    position: absolute;
    top: -10px;
    left: 0;
    right: 0;
    height: 10px;
}

/* Genre items grid */
.genres-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
}

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

/* ============================================
   Responsive: Tablet (max-width: 1024px)
   ============================================ */
@media (max-width: 1024px) {
    .navbar-top {
        padding: 10px 20px;
    }

    .navbar-bottom {
        padding: 0 20px;
    }

    .search-input {
        width: 250px;
    }

    .nav-links {
        gap: 4px;
    }

    .nav-link,
    .genres-trigger {
        padding: 6px 10px;
        font-size: 13px;
    }

    .genres-dropdown {
        min-width: 280px;
    }

    .genres-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* ============================================
   Responsive: Mobile (max-width: 768px)
   ============================================ */
@media (max-width: 768px) {
    .navbar-top {
        flex-direction: column;
        gap: 12px;
        padding: 12px 16px;
    }

    .search-input {
        width: 100%;
    }

    .navbar-bottom {
        padding: 0 16px;
        overflow-x: auto;
    }

    .nav-links {
        gap: 2px;
        padding: 8px 0;
    }

    .nav-link,
    .genres-trigger {
        padding: 6px 8px;
        font-size: 12px;
    }

    /* Dropdown full-width on mobile */
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
        display: none;
    }

    .genres-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
```

---

## Summary of Changes

| Aspect | Before | After |
|--------|--------|-------|
| **Layout** | Single row, all elements crammed | Two rows: Top (Logo + Search), Bottom (Nav links) |
| **Font Size** | Inherited (~16px) | Reduced to 14px for nav items |
| **Gap Between Items** | 14px | 6px (more items, needs tighter spacing) |
| **Padding** | 15px 30px (single container) | Split: 12px 30px (top), 10px 0 (bottom) |
| **Visual Separation** | None | Border-bottom between rows |
| **Search Bar Width** | 300px | 350px (more room in top row) |
| **Country Dropdown** | Nearly overflowing | Properly spaced in bottom row with scroll on mobile |

## Benefits

1. **Better readability** — Two rows provide clear visual hierarchy
2. **No overflow issues** — Country dropdown has ample space
3. **Scalable** — Easy to add more nav items in the future
4. **Responsive** — Mobile layout handles small screens gracefully with horizontal scroll and full-width search
5. **Cleaner look** — Border separator between rows adds structure

## Testing Checklist

- [ ] Verify navbar displays correctly on desktop (1920px+)
- [ ] Verify navbar displays correctly on tablet (768px - 1024px)
- [ ] Verify navbar displays correctly on mobile (< 768px)
- [ ] Test dropdown menus open/close properly
- [ ] Test search bar functionality
- [ ] Test all nav links navigate correctly
- [ ] Verify sticky behavior on scroll
- [ ] Check for any visual overflow or clipping issues